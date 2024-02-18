bin := cheapshot
src := $(wildcard **/*.go)

.PHONY: $(bin)
$(bin): $(src)
	go build -o $@ ./cmd/cheapshot

run: $(bin)
	./$(bin)
