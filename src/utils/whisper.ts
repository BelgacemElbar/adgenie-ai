import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCaptions(text: string): Promise<string> {
  const outputPath = path.join(process.cwd(), `public/captions-${Date.now()}.srt`);

  // Whisper can generate from audio too; for simplicity we convert text to captions directly
  const captions = text.split(". ").map((line, i) => `${i+1}\n00:00:${i*3 < 10 ? '0'+i*3 : i*3},000 --> 00:00:${(i+1)*3 < 10 ? '0'+(i+1)*3 : (i+1)*3},000\n${line}\n`).join("\n");

  fs.writeFileSync(outputPath, captions);
  return outputPath;
}
