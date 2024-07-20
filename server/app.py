from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO
from datetime import datetime
import random
import string
from flask import request
import os
import ffmpeg

app = Flask(__name__)
socketio = SocketIO(app)

num_phones = 0

@app.route('/')
def hello_world():
  return render_template('index.html', timestamp=datetime.now())

@app.route('/capture')
def capture():
  return render_template('capture.html')

@app.route('/debug')
def debug():
  return render_template('debug.html', num_phones=num_phones)

@app.post('/api/v1/snapshots')
def create_snapshot():
  snapshot_id = generate_id()
  app.logger.info(f"Snapshot {snapshot_id} created, triggering phones")
  socketio.emit('take_snapshot', { 'id': snapshot_id})
  return jsonify({
    "id": snapshot_id,
    "createdAt": datetime.utcnow(),
  })

@app.get('/api/v1/snapshots/<snapshot_id>')
def get_singular_snapshot(snapshot_id):
  if request.accept_mimetypes.best == 'application/json':
    # Get number of files in snapshot directory
    snapshot_dir = f'./snapshots/{snapshot_id}'
    if not os.path.exists(snapshot_dir):
      return jsonify({'error': 'Snapshot not found'}), 404
    num_files = len([name for name in os.listdir(snapshot_dir) if os.path.isfile(os.path.join(snapshot_dir, name))])

    if num_files < num_phones:
      return jsonify({
        "id": snapshot_id,
        "createdAt": datetime.utcnow(),
        "status": "processing",
      })

    if os.path.exists(f'./snapshots/{snapshot_id}/snapshot.mp4'):
      return jsonify({
        "id": snapshot_id,
        "createdAt": datetime.utcnow(),
        "status": "complete",
      })
    else:
      render_snapshot(snapshot_id)
      return jsonify({
        "id": snapshot_id,
        "createdAt": datetime.utcnow(),
        "status": "complete",
      })

  elif request.accept_mimetypes.best == 'video/mp4':
    snapshot_file = f'./snapshots/{snapshot_id}/snapshot.mp4'
    if not os.path.exists(snapshot_file):
      return 404
    return send_file(snapshot_file, as_attachment=True)

@app.put('/api/v1/snapshots/<snapshot_id>/photos/<phone_index>')
def upload_photo(snapshot_id, phone_index):
  if 'photo' not in request.files:
    app.logger.error("No photo in request")
    return jsonify({'error': 'No photo in request'}), 400

  photo = request.files['photo']
  snapshot_dir = f'./snapshots/{snapshot_id}'
  if not os.path.exists(snapshot_dir):
    os.makedirs(snapshot_dir)
  photo.save(f'./snapshots/{snapshot_id}/{phone_index}.webp')
  app.logger.info(f"Photo from phone {phone_index} saved to disk")
  return jsonify({
    "message": "Photo uploaded successfully"
  })

def generate_id(length=12):
  characters = string.ascii_letters + string.digits
  return ''.join(random.choice(characters) for _ in range(length))

@socketio.on('connect')
def handle_connect():
  app.logger.info('Client connected')
  global num_phones
  num_phones = num_phones + 1

@socketio.on('disconnect')
def handle_disconnect():
  app.logger.info('Client disconnected')
  global num_phones
  num_phones = num_phones - 1

# Example WebSocket event handler
@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)

if __name__ == '__main__':
    socketio.run(app)

def render_snapshot(snapshot_id):
  # Assuming temp_dir and output_filename are defined
  snapshot_dir = f"./snapshots/{snapshot_id}"
  output_filename = f"./snapshots/{snapshot_id}/snapshot.mp4"

  # Input
  input_images = f"{snapshot_dir}/%d.webp"

  # Create the main input stream
  stream = ffmpeg.input(input_images, framerate=6)

  split = stream.filter_multi_output('split')

  # Create the boomerang effect using complex filtergraph
  original = split.stream(0)
  original.filter('trim', start_frame=0, end_frame='eof')
  reversed_stream = split.stream(1)
  reversed_stream.filter('trim', start_frame=0, end_frame='eof').filter('reverse')

  # Concatenate the streams
  boomerang = ffmpeg.concat(original, reversed_stream, original)

  # Output
  output = ffmpeg.output(
      boomerang,
      output_filename,
      vcodec='libx264',
      r=30,
      pix_fmt='yuvj422p'
  )

  # Run the ffmpeg command
  ffmpeg.run(output)
