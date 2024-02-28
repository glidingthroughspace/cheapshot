import 'package:cheapshot/client/config.dart';
import 'package:http/http.dart' as http;
import 'package:logging/logging.dart';
import 'package:web_socket_channel/status.dart' as status;
import 'package:web_socket_channel/web_socket_channel.dart';

class APIClient {
  final _config = Config();
  WebSocketChannel? _channel;
  final log = Logger("APIClient");
  Function(String snapshotId)? _onTakePictureEventListener;
  Function? _onStartStreaming;
  Function? _onStopStreaming;

  Future<bool> serverIsReachable() async {
    if (await _config.getServerURL() == null) {
      return false;
    }

    try {
      await get("/health").timeout(const Duration(seconds: 2));
    } catch (err) {
      log.severe("Server's health endpoint not reachable", err);
      return false;
    }
    return true;
  }

  Future<void> connectToServer(int phoneIndex) async {
    var serverURL = await _config.getServerURL();
    if (serverURL == null) {
      throw Exception("Server URL not set");
    }
    var uri = Uri.parse("ws://$serverURL/phones/$phoneIndex");
    log.info("Connecting websocket to $uri");
    _channel = WebSocketChannel.connect(uri);
    _channel?.stream.listen((event) {
      if (event is String) {
        log.info("Received event '$event' from server");
        if (event.startsWith("take_photo")) {
          final snapshotId = event.split("|")[1];
          if (_onTakePictureEventListener != null) {
            _onTakePictureEventListener!(snapshotId);
          }
        } else if (event == "start_streaming") {
          if (_onStartStreaming != null) {
            _onStartStreaming!();
          }
        } else if (event == "stop_streaming") {
          if (_onStopStreaming != null) {
            _onStopStreaming!();
          }
        }
      }
      log.info("WebSocket message from server: $event");
    });
    return _channel?.ready.timeout(const Duration(seconds: 3));
  }

  Future<void> uploadPhoto(String path, String snapshotId) async {
    final serverURL = await _config.getServerURL();
    if (serverURL == null) {
      throw Exception("Server URL not set");
    }
    final phoneIndex = await _config.getPhoneIndex();
    if (phoneIndex == null) {
      throw Exception("Phone index not set");
    }
    final uri = Uri.parse("http://$serverURL/phones/$phoneIndex/photos");
    var request = http.MultipartRequest("POST", uri);
    request.files.add(await http.MultipartFile.fromPath("photo", path, filename: snapshotId));
    var response = await request.send();
    if (response.statusCode != 200) {
      throw Exception("Failed to upload photo: ${response.statusCode}");
    }
    log.info("Uploaded photo");
  }

  void onTakePictureEvent(Function(String snapshotId) f) {
    _onTakePictureEventListener = f;
  }

  void onStartStreaming(Function f) {
    _onStartStreaming = f;
  }

  void onStopStreaming(Function f) {
    _onStopStreaming = f;
  }

  void disconnectFromServer() {
    log.info("Disconnecting WebSocket");
    _channel?.sink.close(status.goingAway);
  }

  Future<Uri> buildURI(String path, Map<String, String>? query) async {
    var serverUrl = await _config.getServerURL();
    if (serverUrl == null) {
      throw Exception("Server URL not set");
    }
    return Uri.http(serverUrl, path, query);
  }

  Future<http.Response> get(String path, [Map<String, String>? query]) async {
    return http.get(await buildURI(path, query));
  }

  Future<http.Response> post(String path, String body, [Map<String, String>? query]) async {
    return http.post(await buildURI(path, query), body: body);
  }

  Future<http.Response> put(String path, String body, [Map<String, String>? query]) async {
    return http.put(await buildURI(path, query), body: body);
  }

  Future<http.Response> delete(String path, [Map<String, String>? query]) async {
    return http.delete(await buildURI(path, query));
  }
}
