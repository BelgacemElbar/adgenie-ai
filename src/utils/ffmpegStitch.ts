import ffmpeg from "fluent-ffmpeg";
import { createTempFilePath } from "./tempFiles";

const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function stitchVideo(
  clips: string[],
  voicePath: string,
  captionsPath: string,
  logoPath?: string,
  bgColor: string = "#000000"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputPath = createTempFilePath("final", "mp4");

    let command = ffmpeg();

    clips.forEach((clip) => {
      command = command.input(clip);
    });

    command = command.input(voicePath);

    const vfFilters = [
      `scale=720:1280:force_original_aspect_ratio=decrease`,
      `pad=720:1280:(ow-iw)/2:(oh-ih)/2:${bgColor}`
    ];

    if (captionsPath) {
      vfFilters.push(`subtitles='${captionsPath.replace(/\\/g, "/")}'`);
    }

    if (logoPath) {
      command = command.input(logoPath);
      vfFilters.push(`overlay=W-w-10:H-h-10`);
    }

    command
      .complexFilter(vfFilters)
      .outputOptions("-c:v libx264", "-c:a aac", "-shortest")
      .on("start", (cmd) => console.log("FFmpeg command:", cmd))
      .on("error", (err) => reject(err))
      .on("end", () => resolve(outputPath))
      .save(outputPath);
  });
}
