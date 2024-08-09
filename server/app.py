import os
import random
import string
from datetime import datetime

import ffmpeg
from flask import Flask, jsonify, render_template, request, send_file
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

num_phones = 0


@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = (
        "no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0"
    )
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "-1"
    return response


@app.route("/")
def index():
    global num_phones
    return render_template("index.html", num_phones=num_phones)


@app.route("/phones/<phone_index>")
def phone_page(phone_index):
    return render_template(
        "phone_page.html", timestamp=datetime.now(), phone_index=phone_index
    )


@app.route("/manage")
def debug():
    return render_template(
        "manage.html", num_phones=num_phones, snapshots=get_snapshots()
    )


@app.post("/api/v1/debug/reload")
def reload_phones():
    socketio.emit("reload")
    return jsonify({"message": "Reloaded"})


@app.post("/api/v1/snapshots")
def create_snapshot():
    # The current time as YYMMDDHHMMSS
    timestamp = datetime.now().strftime("%y%m%d%H%M%S")
    snapshot_id = timestamp + "-" + generate_id(4)
    app.logger.info(f"Snapshot {snapshot_id} created, triggering phones")
    socketio.emit("take_snapshot", {"id": snapshot_id})
    return jsonify(
        {
            "id": snapshot_id,
            "createdAt": datetime.now(),
        }
    )


@app.get("/api/v1/snapshots")
def api_get_snapshots():
    return jsonify(get_snapshots())


def get_snapshots():
    # Read all folders in the snapshots directory
    snapshots = [
        {"name": name}
        for name in os.listdir("./snapshots")
        if os.path.isdir(os.path.join("./snapshots", name))
    ]
    # Add a status field to each snapshot. If the snapshot is complete, the status will be 'complete'. Otherwise, it will be 'processing'
    for snapshot in snapshots:
        snapshot_dir = f"./snapshots/{snapshot}"
        if os.path.exists(f"{snapshot_dir}/snapshot.mp4"):
            snapshots[snapshots.index(snapshot)]["status"] = "complete"
        else:
            snapshots[snapshots.index(snapshot)]["status"] = "processing"
    # Add an url field to each snapshot. It's just the name of the snapshot prefixed with '/api/v1/snapshots/'
    for snapshot in snapshots:
        snapshots[snapshots.index(snapshot)]["url"] = (
            f'/api/v1/snapshots/{snapshot["name"]}'
        )
    # Sort the snapshots by name, in reverse order
    snapshots.sort(key=lambda x: x["name"], reverse=True)
    return snapshots


@app.get("/api/v1/snapshots/<snapshot_id>")
def api_get_singular_snapshot(snapshot_id):
    if (
        request.accept_mimetypes.best == "application/json"
        or request.accept_mimetypes.best == "text/html"
    ):
        # Get number of files in snapshot directory
        snapshot_dir = f"./snapshots/{snapshot_id}"
        if not os.path.exists(snapshot_dir):
            return jsonify({"error": "Snapshot not found"}), 404
        num_files = len(
            [
                name
                for name in os.listdir(snapshot_dir)
                if os.path.isfile(os.path.join(snapshot_dir, name))
            ]
        )

        if num_files < num_phones:
            return jsonify(
                {
                    "id": snapshot_id,
                    "createdAt": datetime.now(datetime.UTC),
                    "status": "processing",
                }
            )

        if os.path.exists(f"./snapshots/{snapshot_id}/snapshot.mp4"):
            return jsonify(
                {
                    "id": snapshot_id,
                    "createdAt": datetime.utcnow(),
                    "status": "complete",
                }
            )
        else:
            render_snapshot(snapshot_id)
            return jsonify(
                {
                    "id": snapshot_id,
                    "createdAt": datetime.utcnow(),
                    "status": "complete",
                }
            )

    else:  # request.accept_mimetypes.best == 'video/mp4':
        snapshot_file = f"./snapshots/{snapshot_id}/snapshot.mp4"
        if not os.path.exists(snapshot_file):
            # Send a 404 response
            return jsonify({"error": "Snapshot not found"}), 404
        return send_file(snapshot_file, as_attachment=True)


@app.put("/api/v1/snapshots/<snapshot_id>/photos/<phone_index>")
def upload_photo(snapshot_id, phone_index):
    if "photo" not in request.files:
        app.logger.error("No photo in request")
        return jsonify({"error": "No photo in request"}), 400

    photo = request.files["photo"]
    snapshot_dir = f"./snapshots/{snapshot_id}"
    if not os.path.exists(snapshot_dir):
        os.makedirs(snapshot_dir)
    photo.save(f"./snapshots/{snapshot_id}/{phone_index}.webp")
    app.logger.info(f"Photo from phone {phone_index} saved to disk")
    return jsonify({"message": "Photo uploaded successfully"})


def generate_id(length=12):
    characters = string.ascii_letters + string.digits
    return "".join(random.choice(characters) for _ in range(length))


@socketio.on("connect")
def handle_connect():
    app.logger.info("Client connected")
    global num_phones
    num_phones = num_phones + 1


@socketio.on("disconnect")
def handle_disconnect():
    app.logger.info("Client disconnected")
    global num_phones
    num_phones = num_phones - 1


# Example WebSocket event handler
@socketio.on("message")
def handle_message(message):
    print("received message: " + message)


if __name__ == "__main__":
    socketio.run(app)


def render_snapshot(snapshot_id):
    # Assuming temp_dir and output_filename are defined
    snapshot_dir = f"./snapshots/{snapshot_id}"
    output_filename = f"./snapshots/{snapshot_id}/snapshot.mp4"

    # Input
    input_images = f"{snapshot_dir}/%d.webp"

    # Create the main input stream
    stream = ffmpeg.input(input_images, framerate=6)

    # Create two identical streams
    stream1 = stream
    stream2 = stream

    # Apply reverse filter to the second stream
    reversed_stream = ffmpeg.filter(stream2, "reverse")

    # Concatenate the streams
    boomerang = ffmpeg.concat(stream1, reversed_stream, stream1)
    # Output
    output = ffmpeg.output(
        boomerang, output_filename, vcodec="libx264", r=30, pix_fmt="yuvj422p"
    )

    # Run the ffmpeg command
    ffmpeg.run(output, overwrite_output=True)
