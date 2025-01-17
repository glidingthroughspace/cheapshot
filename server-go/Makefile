BINARY := "cheapshot"
SRC := $(shell find . -name "*.go" -type f -not -path "./vendor/*")

$(BINARY): $(SRC)
	go build -o $(BINARY) ./cmd/cheapshot

run: $(BINARY)
	./$(BINARY)
