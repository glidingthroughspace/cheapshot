package handler

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/glidingthroughspace/cheapshot/messaging"
)

func PollSnapshot(hub *messaging.Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		snapshotID := r.PathValue("id")
		slog.Info("Polling snapshot", "snapshotID", snapshotID)
		_, err := os.Stat(filepath.Join("uploads", snapshotID))
		if os.IsNotExist(err) {
			http.Error(w, "Snapshot not found", http.StatusNotFound)
			return
		}
		if err != nil {
			slog.Error("Failed to stat snapshot directory", "snapshotID", snapshotID, "error", err)
			http.Error(w, "Failed to stat snapshot directory", http.StatusInternalServerError)
			return
		}
		files, err := os.ReadDir(filepath.Join("uploads", snapshotID))
		slog.Info("Read snapshot directory", "snapshotID", snapshotID, "files", len(files))
		if err != nil {
			slog.Error("Failed to read snapshot directory", "snapshotID", snapshotID, "error", err)
			http.Error(w, "Failed to read snapshot directory", http.StatusInternalServerError)
			return
		}
		if len(files) >= hub.ClientCount() {
			slog.Info("All files are there, starting to process video", "snapshotID", snapshotID, "files", len(files), "clients", hub.ClientCount())
			// Run the ./scripts/to-video.sh script
			cmd := exec.Command("../scripts/to-video.sh", fmt.Sprintf("uploads/%s", snapshotID), "snapshots")
			cmd.Stderr = os.Stderr
			err = cmd.Run()
			if err != nil {
				slog.Error("Failed to run to-video.sh script", "error", err)
				http.Error(w, "Failed to make video", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			return
		}
		w.WriteHeader(http.StatusPartialContent)
	}
}
