package handler

import (
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/glidingthroughspace/cheapshot/messaging"
)

func GetSnapshot(hub *messaging.Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		snapshotID := r.PathValue("id")
		slog.Info("Getting snapshot", "snapshotID", snapshotID)
		fileInfo, err := os.Stat(filepath.Join("snapshots", snapshotID+".mp4"))
		if os.IsNotExist(err) {
			http.Error(w, "Snapshot not found", http.StatusNotFound)
			slog.Error("Snapshot not found", "snapshotID", snapshotID)
			return
		}
		if err != nil {
			slog.Error("Failed to stat snapshot", "snapshotID", snapshotID, "error", err)
			http.Error(w, "Failed to stat snapshot", http.StatusInternalServerError)
			return
		}
		file, err := os.Open(filepath.Join("snapshots", snapshotID+".mp4"))
		if err != nil {
			slog.Error("Failed to open snapshot file", "snapshotID", snapshotID, "error", err)
			http.Error(w, "Failed to open snapshot file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		w.Header().Set("Content-Type", "video/mp4")
		w.Header().Set("Content-Disposition", "attachment; filename="+snapshotID+".mp4")
		w.Header().Set("Content-Length", strconv.FormatInt(fileInfo.Size(), 10))

		_, err = io.Copy(w, file)
		if err != nil {
			slog.Error("Failed to send snapshot file", "snapshotID", snapshotID, "error", err)
			http.Error(w, "Failed to send snapshot file", http.StatusInternalServerError)
			return
		}
	}
}
