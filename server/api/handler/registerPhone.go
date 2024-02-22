package handler

import (
	"log/slog"
	"net/http"
	"strconv"

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
		phoneIndex, err := strconv.Atoi(index)
		if err != nil {
			slog.Error("Failed to parse phone index", "index", index, "error", err)
			http.Error(w, "Invalid phone index", http.StatusBadRequest)
			return
		}
		slog.Info("Registering phone", "phoneIndex", phoneIndex)
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			slog.Error("Failed to upgrade connection", "error", err)
			return
		}
		client := messaging.NewClient(hub, conn, phoneIndex)
		hub.Register <- client

		// Allow collection of memory referenced by the caller by doing all work in
		// new goroutines.
		go client.WritePump()
		go client.ReadPump()
	}
}
