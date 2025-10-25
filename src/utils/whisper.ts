import fs from "fs";
import { createTempFilePath } from "./tempFiles";

export async function generateCaptions(text: string): Promise<string> {
  const outputPath = createTempFilePath("captions", "srt");
  const sentences = text.split(/\.\s+/).filter(Boolean);

  const captions = sentences
    .map((line, index) => {
      const startSeconds = index * 3;
      const endSeconds = (index + 1) * 3;
      const formatTime = (seconds: number) => {
        const padded = seconds.toString().padStart(2, "0");
        return `00:00:${padded},000`;
      };

      return `${index + 1}\n${formatTime(startSeconds)} --> ${formatTime(endSeconds)}\n${line}\n`;
    })
    .join("\n");

  await fs.promises.writeFile(outputPath, captions);
  return outputPath;
}
