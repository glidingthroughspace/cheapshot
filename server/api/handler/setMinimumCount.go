package handler

import (
	"io"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/glidingthroughspace/cheapshot/messaging"
)

func SetMinimumCount(hub *messaging.Hub) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Content-Type") != "text/plain" {
			slog.Warn("Invalid content type when setting minimum phone count", "value", r.Header.Get("Content-Type"))
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		rawPhoneCount, err := io.ReadAll(r.Body)
		if err != nil {
			slog.Error("Failed to read request body", "error", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		phoneCount, err := strconv.Atoi(string(rawPhoneCount))
		if err != nil {
			slog.Error("Minimum phone count is not a number", "error", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		slog.Info("Setting minimum number of phones", "count", phoneCount)
		hub.SetMinimumClientCount(phoneCount)
	})
}
