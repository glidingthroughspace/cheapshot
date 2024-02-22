package handler

import (
	"log/slog"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"time"
	"unsafe"

	"github.com/glidingthroughspace/cheapshot/messaging"
)

const (
	snapshotIDLength = 8
)

func TakePhoto(hub *messaging.Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slog.Info("Received request to take photo")
		snapshotID := RandStringBytes(snapshotIDLength)
		os.MkdirAll(filepath.Join("uploads", snapshotID), os.ModePerm)
		hub.BroadcastBytes([]byte("take_photo|" + snapshotID))
		w.Write([]byte("OK"))
	}
}

var src = rand.NewSource(time.Now().UnixNano())

const letterBytes = "abcdefghijklmnopqrstuvwxyz0123456789-"
const (
	letterIdxBits = 6                    // 6 bits to represent a letter index
	letterIdxMask = 1<<letterIdxBits - 1 // All 1-bits, as many as letterIdxBits
	letterIdxMax  = 63 / letterIdxBits   // # of letter indices fitting in 63 bits
)

func RandStringBytes(n int) string {
	b := make([]byte, n)
	// A src.Int63() generates 63 random bits, enough for letterIdxMax characters!
	for i, cache, remain := n-1, src.Int63(), letterIdxMax; i >= 0; {
		if remain == 0 {
			cache, remain = src.Int63(), letterIdxMax
		}
		if idx := int(cache & letterIdxMask); idx < len(letterBytes) {
			b[i] = letterBytes[idx]
			i--
		}
		cache >>= letterIdxBits
		remain--
	}

	return *(*string)(unsafe.Pointer(&b))
}
