package handler

import (
	"log/slog"
	"net/http"

	"github.com/glidingthroughspace/cheapshot/messaging"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func RegisterPhone(hub *messaging.Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		index := r.PathValue("index")
		slog.Info("Registering phone", "index", index)
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			slog.Error("Failed to upgrade connection", "error", err)
			return
		}
		client := messaging.NewClient(hub, conn)
		client.Hub.Register <- client

		// Allow collection of memory referenced by the caller by doing all work in
		// new goroutines.
		go client.WritePump()
		go client.ReadPump()
	}
}
