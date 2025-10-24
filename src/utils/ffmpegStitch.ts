import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export async function stitchVideo(
  clips: string[],
  voicePath: string,
  captionsPath: string,
  logoPath?: string,
  bgColor: string = "#000000"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(process.cwd(), `public/final-${Date.now()}.mp4`);

    // Start FFmpeg command
    let command = ffmpeg();

    // Add clips as inputs
    clips.forEach((clip) => {
      command = command.input(clip);
    });

    // Add voiceover
    command = command.input(voicePath);

    // Video filter options
    let vfFilters = [
      `scale=720:1280:force_original_aspect_ratio=decrease`,
      `pad=720:1280:(ow-iw)/2:(oh-ih)/2:${bgColor}`
    ];

    // Add captions if provided
    if (captionsPath) {
      vfFilters.push(`subtitles='${captionsPath.replace(/\\/g, "/")}'`);
    }

    // Add logo overlay if provided
    if (logoPath) {
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
