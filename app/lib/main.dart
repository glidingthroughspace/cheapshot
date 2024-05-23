import 'dart:async';

import 'package:camera/camera.dart';
import 'package:cheapshot/client/api_client.dart';
import 'package:cheapshot/client/config.dart';
import 'package:cheapshot/connection_status.dart';
import 'package:cheapshot/widgets/connect_to_server_sheet.dart';
import 'package:cheapshot/widgets/header_status_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:logging/logging.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

Future<void> main() async {
  Logger.root.level = Level.ALL;
  Logger.root.onRecord.listen((record) {
    // ignore: avoid_print
    print('${record.level.name}: ${record.time}: ${record.message}');
  });
  // Ensure that plugin services are initialized so that `availableCameras()`
  // can be called before `runApp()`
  WidgetsFlutterBinding.ensureInitialized();
  WakelockPlus.enable();

  // Obtain a list of the available cameras on the device.
  final cameras = await availableCameras();

  // Get a specific camera from the list of available cameras.
  final firstCamera = cameras.first;

  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]).then((_) => runApp(
        MaterialApp(
          theme: ThemeData.dark(useMaterial3: true),
          home: CheapShotHome(
            // Pass the appropriate camera to the TakePictureScreen widget.
            camera: firstCamera,
          ),
        ),
      ));
}

// A screen that allows users to take a picture using a given camera.
class CheapShotHome extends StatefulWidget {
  const CheapShotHome({
    super.key,
    required this.camera,
  });

  final CameraDescription camera;

  @override
  CheapShotHomeState createState() => CheapShotHomeState();
}

class CheapShotHomeState extends State<CheapShotHome> {
  final log = Logger("CheapShotHomeState");
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  late ConnectionStatus _connectionStatus;
  int? _phoneIndex;
  final APIClient _apiClient = APIClient();
  RTCPeerConnection? _rtcPeerConnection;
  MediaStream? _localStream;
  final constraints = {
    'video': {
      'facingMode': 'environment',
    }
  };
  final rtcConfig = {
    'iceServers': [
      {
        'urls': ["stun:stun.l.google.com:19302"]
      }
    ]
  };

  @override
  void initState() {
    super.initState();
    _connectionStatus = ConnectionStatus.disconnected;
    checkServerConnection();
    loadPhoneID();
    _apiClient.onTakePictureEvent(_onTakePicture);
    _apiClient.onStartStreaming(_onStartStraming);
    _apiClient.onStopStreaming(_onStopStreaming);
    _apiClient.onConnectionStatusChange(_onConnectionStatusChange);
    _apiClient.onStreamingPeerConnected = _onStreamingPeerConnected;
    _apiClient.onRtcAnswer = _onRtcAnswer;
    _apiClient.onIceCandidate = _onIceCandidate;

    // To display the current output from the Camera,
    // create a CameraController.
    _controller = CameraController(
      // Get a specific camera from the list of available cameras.
      widget.camera,
      // Define the resolution to use.
      ResolutionPreset.max,
      enableAudio: false,
    );

    // Next, initialize the controller. This returns a Future.
    _initializeControllerFuture = _controller.initialize();
  }

  _onTakePicture(String snapshotId) async {
    log.fine("Trying to take a picture");
    // Take the Picture in a try / catch block. If anything goes wrong,
    // catch the error.
    try {
      // Ensure that the camera is initialized.
      await _initializeControllerFuture;
      _controller.lockCaptureOrientation(DeviceOrientation.portraitUp);
      _controller.setFlashMode(FlashMode.off);

      // Attempt to take a picture and get the file `image`
      // where it was saved.
      final image = await _controller.takePicture();

      if (!context.mounted || !mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Uploading photo")));
      await _apiClient.uploadPhoto(image.path, snapshotId);
      if (!context.mounted || !mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Photo uploaded")));
    } catch (e) {
      // If an error occurs, log the error to the console.
      log.severe("Initializing camera failed", e);
    }
  }

  _onStartStraming() async {
    log.fine("Starting WebRTC stream");
    _localStream = await navigator.mediaDevices.getUserMedia(constraints);
    _apiClient.rawWebsocketMessage("broadcaster");
  }

  _onStreamingPeerConnected() async {
    _rtcPeerConnection = await createPeerConnection(rtcConfig);
    if (_localStream == null) {
      log.severe("Trying to add a streaming peer before streaming was started");
      return;
    }
    if (_rtcPeerConnection == null) {
      log.severe("RTC Peer connection is null");
      return;
    }
    _localStream!.getTracks().forEach((track) {
      _rtcPeerConnection!.addTrack(track, _localStream!);
    });
    _rtcPeerConnection!.onIceCandidate = (event) {
      if (event.candidate != null) {
        log.fine("Sending ICE candidate to peer");
        _apiClient.rawWebsocketMessage("canidate", event);
      }
    };
    final offer = await _rtcPeerConnection!.createOffer();
    await _rtcPeerConnection!.setLocalDescription(offer);
    final description = await _rtcPeerConnection!.getLocalDescription();
    log.fine("Sending offer to peer");
    _apiClient.rawWebsocketMessage("offer", description);
  }

  _onRtcAnswer(RTCSessionDescription description) async {
    log.fine("Received answer from peer");
    await _rtcPeerConnection!.setRemoteDescription(description);
  }

  _onIceCandidate(RTCIceCandidate candidate) async {
    log.fine("Received ICE candidate from peer");
    await _rtcPeerConnection!.addCandidate(candidate);
  }

  _onStopStreaming() async {
    log.fine("Stopping WebRTC stream");
    _rtcPeerConnection?.close();
  }

  checkServerConnection() async {
    var reachable = await _apiClient.serverIsReachable();
    setState(() {
      if (reachable) {
        _connectionStatus = ConnectionStatus.reachable;
      } else {
        _connectionStatus = ConnectionStatus.disconnected;
      }
    });
  }

  loadPhoneID() async {
    var phoneIndex = await Config().getPhoneIndex();
    setState(() {
      _phoneIndex = phoneIndex;
    });
  }

  _onConnectionStatusChange(ConnectionStatus status) {
    setState(() {
      _connectionStatus = status;
    });
  }

  onConnectFromSheet() async {
    var phoneIndex = await Config().getPhoneIndex();
    setState(() {
      _phoneIndex = phoneIndex;
    });
    if (phoneIndex != null) {
      log.info("Connecting to websocket server");
      await _apiClient.connectToServer(phoneIndex);
    } else {
      log.info("Phone index is null, not connecting");
    }
  }

  @override
  void dispose() {
    super.dispose();
    // Dispose of the controller when the widget is disposed.
    _controller.dispose();
    _apiClient.disconnectFromServer();
    _rtcPeerConnection?.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            title: const Text('CheapShot'),
            actions: [
              IconButton(
                icon: const Icon(Icons.settings),
                onPressed: () async {
                  var result = await showModalBottomSheet(
                    context: context,
                    builder: (BuildContext context) => const ConnectToServerSheet(),
                    isDismissible: true,
                  );
                  handleConnectModalClosure(result);
                },
              )
            ],
            bottom: HeaderStatusBar(
              connectionStatus: _connectionStatus,
              phoneIndex: _phoneIndex,
            )),
        // You must wait until the controller is initialized before displaying the
        // camera preview. Use a FutureBuilder to display a loading spinner until the
        // controller has finished initializing.
        body: FutureBuilder<void>(
          future: _initializeControllerFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              // If the Future is complete, display the preview.
              return Center(child: CameraPreview(_controller));
            } else {
              // Otherwise, display a loading indicator.
              return const Center(child: CircularProgressIndicator());
            }
          },
        ),
        floatingActionButton: _connectionStatus == ConnectionStatus.connected
            ? FloatingActionButton.extended(
                // Provide an onPressed callback.
                onPressed: () {
                  _apiClient.disconnectFromServer();
                  setState(() {
                    _connectionStatus = ConnectionStatus.disconnected;
                  });
                },
                label: const Text('Disconnect'),
                icon: const Icon(Icons.link_off),
              )
            : FloatingActionButton.extended(
                onPressed: () async {
                  var result = await showModalBottomSheet(
                    context: context,
                    builder: (BuildContext context) => const ConnectToServerSheet(),
                    isDismissible: false,
                  );
                  await handleConnectModalClosure(result);
                },
                label: const Text("Connect"),
                icon: const Icon(Icons.link)));
  }

  Future<void> handleConnectModalClosure(result) async {
    if (result == ConnectToServerSheetResult.connected) {
      final phoneIndex = await Config().getPhoneIndex();
      setState(() {
        _connectionStatus = ConnectionStatus.connected;
        _phoneIndex = phoneIndex;
      });
      if (phoneIndex != null) {
        await _apiClient.connectToServer(phoneIndex);
      } else {
        log.warning("Phone index is null, not connecting");
      }
    } else {
      log.warning("Result of the connect to server sheet: $result");
    }
  }
}
