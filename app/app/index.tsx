// This must be imported before `nanoid`
import "react-native-get-random-values";
// All other imports
import { StatusBar } from "@/components/StatusBar";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useDeviceId } from "@/hooks/useDeviceId";
import { useLastServerHost } from "@/hooks/useLastServerHost";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";

const CameraScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [connectionStatus, setConnectionStatus] = useConnectionStatus();
  const [lastServerHost, setLastServerHost] = useLastServerHost();
  const [serverIp, setServerIp] = useState(lastServerHost);
  const deviceId = useDeviceId();
  const socket = useRef<Socket | null>(null);
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const camera = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const connectToServer = (): void => {
    setConnectionStatus("connecting");
    setLastServerHost(serverIp);
    if (socket.current) {
      socket.current.disconnect();
    }
    socket.current = io(`ws://${serverIp}`, {
      extraHeaders: {
        role: "capture-device",
        id: deviceId,
      },
      reconnection: true,
    });
    socket.current.on("error", (error) => {
      console.log(error);
    });
    socket.current.on(
      "capture-now",
      async ({ captureId }: { captureId: string }) => {
        console.log("Capturing now!");
        const picture = await camera.current?.takePictureAsync({
          quality: 0.9,
          exif: true,
          imageType: "jpg",
          base64: true,
        });
        if (picture) {
          const formData = new FormData();
          // console.debug("Fetching image to blob");
          const file = {
            uri: picture.uri,
            name: `${captureId}-${deviceId}.jpg`,
            type: "image/jpeg",
          };
          // const blob = await (await fetch(file.uri)).blob();
          // console.debug("Blob size", blob.size);
          // @ts-ignore
          formData.append("photo", file);

          try {
            console.debug("Sending picture to server");
            const url = `http://${serverIp}/api/v1/captures/${captureId}/photos/${deviceId}`;
            console.debug("URL is", url);
            const response = await fetch(url, {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
              body: formData,
            });

            console.log("Server response status:", response.status);
            const responseText = await response.text();
            console.log("Server response:", responseText);

            if (response.ok) {
              alert("Photo uploaded successfully!");
            } else {
              throw new Error(
                `Server responded with status ${response.status}: ${responseText}`
              );
            }
          } catch (error) {
            console.error("Error uploading picture", error);
            console.dir(error);
          }
        }
      }
    );
    socket.current.on("connect", () => {
      setConnectionStatus("connected");
    });
    socket.current.on("disconnect", () => setConnectionStatus("disconnected"));
  };

  const disconnectFromServer = (): void => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar deviceId={deviceId} connectionStatus={connectionStatus} />

      <CameraView
        style={styles.camera}
        ratio="4:3"
        mode="picture"
        zoom={0}
        autofocus="on"
        ref={camera}
      />

      <BottomSheet ref={bottomSheetModalRef} index={1} snapPoints={snapPoints}>
        <BottomSheetView style={styles.centeredView}>
          <TextInput
            placeholder="Server IP"
            autoCapitalize="none"
            keyboardType="url"
            onChangeText={setServerIp}
            value={serverIp}
            style={styles.serverIpInput}
          ></TextInput>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              connectToServer();
            }}
          >
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
  },
  camera: {
    flex: 1,
  },
  infoContainer: {
    position: "relative",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
  },
  serverIpInput: {
    fontSize: 16,
    padding: 10,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: 1,
    borderStyle: "solid",
    width: "90%",
    marginBottom: 16,
  },
});

export default CameraScreen;
