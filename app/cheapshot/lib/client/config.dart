import 'package:shared_preferences/shared_preferences.dart';

class Config {
  final keyServerURL = "serverURL";
  final keyPhoneIndex = "phoneIndex";

  Future<bool> setServerURL(String url) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.setString(keyServerURL, url);
  }

  Future<String?> getServerURL() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString(keyServerURL);
  }

  Future<bool> setPhoneIndex(int index) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.setInt(keyPhoneIndex, index);
  }

  Future<int?> getPhoneIndex() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getInt(keyPhoneIndex);
  }
}
