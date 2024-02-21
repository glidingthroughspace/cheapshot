enum ConnectionStatus {
  unknown,
  // The server is not reachable or the reachability check hasn't been performed yet
  disconnected,
  // The server is reachable, but the websocket connection hasn't been established yet
  reachable,
  // The websocket connection is established
  connected
}
