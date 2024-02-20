import 'package:cheapshot/client/api_client.dart';
import 'package:cheapshot/client/config.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ConnectToServerSheet extends StatefulWidget {
  const ConnectToServerSheet({super.key});

  @override
  State<ConnectToServerSheet> createState() => _ConnectToServerSheetState();
}

class _ConnectToServerSheetState extends State<ConnectToServerSheet> {
  late bool _connecting;
  late String _url;
  late int _phoneIndex = -1;
  bool _configLoaded = false;
  late TextEditingController _urlController;
  late TextEditingController _phoneIndexController;

  @override
  void initState() {
    print("Init state called");
    super.initState();
    _connecting = false;
    loadConfig();
  }

  void loadConfig() async {
    var previousURL = await Config().getServerURL();
    var previousPhoneIndex = await Config().getPhoneIndex();
    setState(() {
      _url = previousURL ?? "";
      _phoneIndex = previousPhoneIndex ?? 0;
      _urlController = TextEditingController(text: _url);
      _phoneIndexController = TextEditingController(text: _phoneIndex.toString());
      _configLoaded = true;
    });
  }

  void onConnectRequested() async {
    setState(() {
      _connecting = true;
    });
    Config config = Config();
    config.setServerURL(_url);
    config.setPhoneIndex(_phoneIndex);
    print("Setting server URL to $_url");
    print("Testing reachability");
    var reachable = await APIClient().serverIsReachable();
    print(reachable ? "Server is reachable" : "Server is not reachable");
    if (reachable) {
      if (!mounted) return;
      Navigator.pop(context, 'connected');
    } else {
      setState(() {
        _connecting = false;
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Could not connect to server'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_configLoaded) {
      return Container(
          padding: const EdgeInsets.all(20), alignment: Alignment.center, child: const CircularProgressIndicator());
    }
    return Container(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          const Text('Connect to Server'),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Server URL',
            ),
            keyboardType: TextInputType.url,
            controller: _urlController,
            onChanged: (String value) {
              setState(() {
                _url = value;
              });
            },
          ),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Phone Index',
            ),
            keyboardType: TextInputType.number,
            inputFormatters: <TextInputFormatter>[FilteringTextInputFormatter.digitsOnly],
            controller: _phoneIndexController,
            onChanged: (String value) {
              setState(() {
                _phoneIndex = int.parse(value);
              });
            },
          ),
          _connecting
              ? const CircularProgressIndicator()
              : ElevatedButton(
                  onPressed: () {
                    onConnectRequested();
                  },
                  child: const Text('Connect'),
                ),
        ]));
  }
}
