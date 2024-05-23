package handler

import (
	"log/slog"
	"net/http"

	"github.com/glidingthroughspace/cheapshot/messaging"
)

func PreviewIP(hub *messaging.Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ip := hub.IPOfCenterPhone()
		if ip == nil {
			slog.Warn("IP address of center phone is unknown")
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.Write([]byte(ip.String()))
	}
}
