import 'package:cheapshot/client/config.dart';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';

class APIClient {
  var config = Config();
  WebSocketChannel? _channel;

  Future<bool> serverIsReachable() async {
    if (await config.getServerURL() == null) {
      return false;
    }

    try {
      await get("/health").timeout(const Duration(seconds: 2));
    } catch (err) {
      print(err);
      return false;
    }
    return true;
  }

  Future<void> connectToServer(int phoneIndex) async {
    var serverURL = await config.getServerURL();
    if (serverURL == null) {
      throw Exception("Server URL not set");
    }
    var uri = Uri.parse("ws://$serverURL/phones/$phoneIndex");
    print("Connecting websocket to $uri");
    _channel = WebSocketChannel.connect(uri);
    _channel?.stream.listen((event) {
      print(event);
    });
    return _channel?.ready.timeout(const Duration(seconds: 3));
  }

  void disconnectFromServer() {
    print("Disconnecting websocket");
    _channel?.sink.close();
  }

  Future<Uri> buildURI(String path, Map<String, String>? query) async {
    var serverUrl = await config.getServerURL();
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
