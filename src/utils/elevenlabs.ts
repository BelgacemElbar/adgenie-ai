import fs from "fs";
import fetch from "node-fetch";
import { createTempFilePath } from "./tempFiles";

export async function generateVoiceover(text: string): Promise<string> {
  const outputPath = createTempFilePath("voice", "mp3");

  const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/voice-id", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      voice: "alloy", // default voice, can change
      format: "mp3"
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate voiceover: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.promises.writeFile(outputPath, Buffer.from(arrayBuffer));

  return outputPath;
}
