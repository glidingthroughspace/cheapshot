package handler

import (
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
)

const megabyte = 1 << 20

func UploadPhoto(w http.ResponseWriter, r *http.Request) {
	phoneIndex := r.PathValue("index")
	slog.Info("Received request to upload photo", "index", phoneIndex)

	err := r.ParseMultipartForm(15 * megabyte)
	if err != nil {
		slog.Error("Error parsing form", "error", err)
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}
	file, header, err := r.FormFile("photo")
	if err != nil {
		slog.Error("Couldn't read file from form", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()

	snapshotID := header.Filename
	targetFileName := phoneIndex + ".jpg"

	// Create a new file in the uploads directory
	dst, err := os.Create(filepath.Join("./uploads", snapshotID, targetFileName))
	if err != nil {
		slog.Error("Couldn't create file", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the created file on the filesystem
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	slog.Info("File uploaded successfully", "snapshotId", header.Filename, "size", header.Size)
	w.Write([]byte("OK"))
}
