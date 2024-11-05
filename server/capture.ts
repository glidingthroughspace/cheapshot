import { $ } from "bun";
import { statSync } from "fs";
import { mkdir, readdir } from "fs/promises";
import { nanoid } from "nanoid";

type CaptureMetadata = {
  devices: string[];
};

const activeCaptures: Record<string, CaptureMetadata> = {};

function padWithZero(num: number): string {
  return num < 10 ? "0" + num : num.toString();
}

function generateCaptureId() {
  const now = new Date();
  const date = `${now.getFullYear()}${padWithZero(now.getMonth())}${padWithZero(
    now.getDate()
  )}`;
  const time = `${padWithZero(now.getHours())}${padWithZero(
    now.getMinutes()
  )}${padWithZero(now.getSeconds())}`;
  const id = `${date}-${time}-${nanoid(5)}`;
  return id;
}

export async function createCapture(devices: string[]) {
  const id = generateCaptureId();
  const directory = `./captures/${id}`;
  await mkdir(directory, { recursive: true });
  activeCaptures[id] = { devices };
  return { directory: "", id };
}

export function allUploadsComplete(id: string): boolean {
  const capture = activeCaptures[id];
  if (!capture) {
    throw Error(`No capture with id ${id} was created in this session`);
  }
  return capture.devices.every((device) => {
    return statSync(`./captures/${id}/${device}.jpg`).isFile();
  });
}

export async function generateVideo(id: string) {
  const capture = activeCaptures[id];
  if (!capture) {
    throw Error(`No capture with id ${id} was created in this session`);
  }
  // Start FFMPEG
  // Create a temporary directory to store the resized images
  const tempDir = (await $`mktemp -d`.text()).trimEnd();
  try {
    // Resize and copy the images to the temporary directory
    for (const file of await readdir(`./captures/${id}`)) {
      //   convert "$file" -resize 2160x3840 "$temp_dir/$(basename "$file")"
      const src = `./captures/${id}/${file}`;
      const dst = `${tempDir}/${capture.devices.findIndex(
        (dev) => dev === file.split(".jpg")[0]
      )}.jpg`;
      await $`cp ${src} ${dst}`;
    }
    await $`ffmpeg -framerate 6 -i "${tempDir}/%d.jpg" -c:v libx264 -r 30 -pix_fmt yuvj422p "${tempDir}/single.mp4"`.quiet();
    await $`ffmpeg -y -i "${tempDir}/single.mp4" -filter_complex '[0]reverse[r];[0][r][0]concat=n=3' "./captures/${id}/${id}.mp4"`.quiet();
    //     await $`ffmpeg -framerate 12 -autorotate -i "${tempDir}/%d.jpg" -filter_complex \
    // 'format=yuv420p,[0]split=3[f1][f2][f3];[f2]reverse[r];[f1][r][f3]concat=n=3:v=1:a=0' \
    // -c:v libx264 -r 30 -pix_fmt yuvj422p \
    // "./captures/${id}/${id}.mp4"`.quiet();
  } catch (error) {
    throw error;
  } finally {
    await $`rm -rf "${tempDir}"`;
  }
}
