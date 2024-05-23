package handler

import (
	"io"
	"log/slog"
	"net/http"
)

func LogFromWeb(w http.ResponseWriter, r *http.Request) {
	message, err := io.ReadAll(r.Body)
	if err != nil {
		slog.Error("Couldn't read log message from web", "err", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	slog.Info("Log from web client", "message", message)
	w.WriteHeader(http.StatusAccepted)
}
