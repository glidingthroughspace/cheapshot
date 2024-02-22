#!/bin/bash
set -euo pipefail

# This script takes all files in a folder given as an argument and turns them into a video showing each photo for 250ms. The video plays backwards once after reaching the end
# Get the folder path from the command line argument
folder_path=$1
output_filename="$(basename "$1").mp4"

# Check if the folder path is provided
if [ -z "$folder_path" ]; then
  echo "Please provide the folder path as an argument."
  exit 1
fi

# Create a temporary directory to store the resized images
temp_dir=$(mktemp -d)

# Resize and copy the images to the temporary directory
for file in "$folder_path"/*; do
#   convert "$file" -resize 2160x3840 "$temp_dir/$(basename "$file")"
    cp "$file" "$temp_dir/$(basename "$file")"
done

# Create the video from the resized images
ffmpeg -framerate 6 -i "$temp_dir/%d.jpg" -c:v libx264 -r 30 -pix_fmt yuvj422p "$temp_dir/single.mp4"
# Make the video a boomerang
ffmpeg -y -i "$temp_dir/single.mp4" -filter_complex '[0]reverse[r];[0][r][0]concat=n=3' "$output_filename"

# Clean up the temporary directory
rm -rf "$temp_dir"

echo "Video created successfully."
