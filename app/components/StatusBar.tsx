import { ConnectionStatus } from "@/hooks/useConnectionStatus";
import { MaterialIcons } from "@expo/vector-icons";
import { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  connectionStatus: ConnectionStatus;
  deviceId: string;
};

export function StatusBar({ connectionStatus, deviceId }: Props) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.text}>{deviceId}</Text>
      <Text style={styles.text}> · </Text>
      <Text style={styles.text}>{iconForStatus[connectionStatus]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    position: "relative",
    backgroundColor: "rgba(0,0,0,0)",
    color: "white",
    padding: 10,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
  },
});

const iconForStatus: Record<ConnectionStatus, ReactElement> = {
  disconnected: (
    <MaterialIcons
      name="signal-cellular-off"
      style={[styles.text, { color: "red" }]}
    />
  ),
  connecting: (
    <MaterialIcons
      name="signal-cellular-alt"
      style={[styles.text, { color: "yellow" }]}
    />
  ),
  connected: (
    <MaterialIcons
      name="signal-cellular-4-bar"
      style={[styles.text, { color: "green" }]}
    />
  ),
};
