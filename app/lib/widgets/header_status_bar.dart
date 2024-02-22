import 'package:cheapshot/connection_status.dart';
import 'package:flutter/material.dart';

class HeaderStatusBar extends StatelessWidget implements PreferredSizeWidget {
  const HeaderStatusBar({super.key, required this.connectionStatus, required this.phoneIndex});

  final ConnectionStatus connectionStatus;
  final int? phoneIndex;
  static const double _height = 48.0;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        height: _height,
        child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(connectionStatus.name,
                  style: TextStyle(
                      color: connectionStatus == ConnectionStatus.connected
                          ? Colors.lightGreen
                          : connectionStatus == ConnectionStatus.reachable
                              ? Colors.yellow
                              : Colors.red,
                      fontSize: 20.0)),
              Text(phoneIndex != null ? "Phone #$phoneIndex" : "Phone # not set",
                  style:
                      TextStyle(color: ThemeData.dark(useMaterial3: true).textTheme.bodyMedium?.color, fontSize: 20.0))
            ]));
  }

  @override
  Size get preferredSize => const Size.fromHeight(_height);
}
