import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export async function generateVoiceover(text: string): Promise<string> {
  const outputPath = path.join(process.cwd(), `public/voice-${Date.now()}.mp3`);

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

  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));

  return outputPath;
}
