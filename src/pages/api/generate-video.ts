import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, type Fields, type Files, type File } from "formidable";
import fs from "fs";
import os from "os";
import { generateScript } from "../../utils/gpt4";
import { generateVoiceover } from "../../utils/elevenlabs";
import { generateCaptions } from "../../utils/whisper";
import { fetchStockClips } from "../../utils/stockClips";
import { stitchVideo } from "../../utils/ffmpegStitch";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
  runtime: "nodejs"
};

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

type ParsedForm = { fields: Fields; files: Files };

function parseForm(req: NextApiRequest): Promise<ParsedForm> {
  const form = new IncomingForm({ multiples: false, keepExtensions: true, uploadDir: os.tmpdir() });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ fields, files });
    });
  });
}

function getFilePath(file?: File | File[]): string | undefined {
  if (!file) return undefined;
  const candidate = Array.isArray(file) ? file[0] : file;
  return (candidate.filepath || (candidate as any).path) as string | undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const textInput = (fields.textInput as string) || "";

    if (!textInput.trim()) {
      return res.status(400).json({ error: "textInput is required" });
    }

    const bgColor = (fields.bgColor as string) || "#000000";
    const logoPath = getFilePath(files.logo as File | File[] | undefined);

    const script = await generateScript(textInput);
    const voicePath = await generateVoiceover(script);
    const captionsPath = await generateCaptions(script);
    const clips = await fetchStockClips(script);
    const finalVideoPath = await stitchVideo(clips, voicePath, captionsPath, logoPath, bgColor);

    const fileBuffer = await fs.promises.readFile(finalVideoPath);
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(`video-${Date.now()}.mp4`, fileBuffer, { contentType: "video/mp4" });

    if (error) {
      throw error;
    }

    const publicURL = supabase.storage.from("videos").getPublicUrl(data.path).data.publicUrl;
    res.status(200).json({ url: publicURL });

    const cleanupTargets = [voicePath, captionsPath, finalVideoPath, logoPath].filter(Boolean) as string[];
    await Promise.allSettled(cleanupTargets.map((target) => fs.promises.unlink(target)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Video generation failed" });
  }
}
