# Server

This is the server component for CheapShot.
It allows multiple phones to connect via WebSockets and provides an API for triggering pictures on all phones

## Development

A `Makefile` is provided to build and run the server. To build it, use the default `make` target.
To also run the server, use `make run`.

By default, the server listens on `localhost:7070`. Use `curl http://localhost:7070/health` to verify the server is running.
