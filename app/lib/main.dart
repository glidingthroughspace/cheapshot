import 'dart:async';
import 'dart:io';

import 'package:camera/camera.dart';
import 'package:cheapshot/client/api_client.dart';
import 'package:cheapshot/client/config.dart';
import 'package:cheapshot/widgets/connect_to_server_sheet.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

Future<void> main() async {
  // Ensure that plugin services are initialized so that `availableCameras()`
  // can be called before `runApp()`
  WidgetsFlutterBinding.ensureInitialized();

  // Obtain a list of the available cameras on the device.
  final cameras = await availableCameras();

  // Get a specific camera from the list of available cameras.
  final firstCamera = cameras.first;

  runApp(
    MaterialApp(
      theme: ThemeData.dark(useMaterial3: true),
      home: CheapShotHome(
        // Pass the appropriate camera to the TakePictureScreen widget.
        camera: firstCamera,
      ),
    ),
  );
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
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  String _connectionStatus = "Disconnected";
  int? _phoneIndex;
  final APIClient _apiClient = APIClient();

  @override
  void initState() {
    super.initState();
    checkServerConnection();
    // To display the current output from the Camera,
    // create a CameraController.
    _controller = CameraController(
      // Get a specific camera from the list of available cameras.
      widget.camera,
      // Define the resolution to use.
      ResolutionPreset.veryHigh,
      enableAudio: false,
    );

    // Next, initialize the controller. This returns a Future.
    _initializeControllerFuture = _controller.initialize();
  }

  Future<void> checkServerConnection() async {
    var reachable = await _apiClient.serverIsReachable();
    setState(() {
      if (reachable) {
        _connectionStatus = "Server reachable";
      }
    });
  }

  @override
  void dispose() {
    // Dispose of the controller when the widget is disposed.
    _controller.dispose();
    super.dispose();
    _apiClient.disconnectFromServer();
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
                await showModalBottomSheet(
                  context: context,
                  builder: (BuildContext context) => const ConnectToServerSheet(),
                  isDismissible: true,
                );
                var phoneIndex = await Config().getPhoneIndex();
                setState(() {
                  _phoneIndex = phoneIndex;
                });
              },
            )
          ],
          bottom: PreferredSize(
              preferredSize: const Size.fromHeight(52.0),
              child: SizedBox(
                  height: 52.0,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(_connectionStatus,
                          style: TextStyle(
                              color: _connectionStatus == "Connected"
                                  ? Colors.lightGreen
                                  : _connectionStatus == "Server reachable"
                                      ? Colors.yellow
                                      : Colors.red,
                              fontSize: 20.0)),
                      Text(_phoneIndex != null ? "Phone #$_phoneIndex" : "Phone # not set",
                          style: TextStyle(
                              color: ThemeData.dark(useMaterial3: true).textTheme.bodyMedium?.color, fontSize: 20.0))
                    ],
                  ))),
        ),
        // You must wait until the controller is initialized before displaying the
        // camera preview. Use a FutureBuilder to display a loading spinner until the
        // controller has finished initializing.
        body: FutureBuilder<void>(
          future: _initializeControllerFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              // If the Future is complete, display the preview.
              return CameraPreview(_controller);
            } else {
              // Otherwise, display a loading indicator.
              return const Center(child: CircularProgressIndicator());
            }
          },
        ),
        floatingActionButton: _connectionStatus == "Connected"
            ? FloatingActionButton(
                // Provide an onPressed callback.
                onPressed: () async {
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

                    if (!context.mounted) return;

                    // If the picture was taken, display it on a new screen.
                    await Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => DisplayPictureScreen(
                          // Pass the automatically generated path to
                          // the DisplayPictureScreen widget.
                          imagePath: image.path,
                        ),
                      ),
                    );
                  } catch (e) {
                    // If an error occurs, log the error to the console.
                    print(e);
                  }
                },
                child: const Icon(Icons.camera_alt),
              )
            : FloatingActionButton.extended(
                onPressed: () async {
                  var result = await showModalBottomSheet(
                    context: context,
                    builder: (BuildContext context) => const ConnectToServerSheet(),
                    isDismissible: false,
                  );
                  var phoneIndex = await Config().getPhoneIndex();
                  if (result == "connected") {
                    setState(() {
                      _connectionStatus = "Connected";
                      _phoneIndex = phoneIndex;
                    });
                    if (phoneIndex != null) {
                      print("Connecting to websocket server");
                      await _apiClient.connectToServer(phoneIndex);
                    } else {
                      print("Phone index is null, not connecting");
                    }
                  } else {
                    print("Result of the connect to server sheet: $result");
                  }
                },
                label: const Text("Connect"),
                icon: const Icon(Icons.link)));
  }
}

// A widget that displays the picture taken by the user.
class DisplayPictureScreen extends StatelessWidget {
  final String imagePath;

  const DisplayPictureScreen({super.key, required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Display the Picture')),
      // The image is stored as a file on the device. Use the `Image.file`
      // constructor with the given path to display the image.
      body: Image.file(File(imagePath)),
    );
  }
}
