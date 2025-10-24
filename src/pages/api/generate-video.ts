import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { generateScript } from "@/utils/gpt4";
import { generateVoiceover } from "@/utils/elevenlabs";
import { generateCaptions } from "@/utils/whisper";
import { fetchStockClips } from "@/utils/stockClips";
import { stitchVideo } from "@/utils/ffmpegStitch";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = new IncomingForm({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const textInput = fields.textInput as string;
      const bgColor = (fields.bgColor as string) || "#000000";
      let logoPath: string | undefined;

      if (files.logo) {
        const file = files.logo[0] || files.logo;
        const tempPath = file.filepath || file.path;
        logoPath = path.join(process.cwd(), `public/${file.originalFilename}`);
        fs.copyFileSync(tempPath, logoPath);
      }

      const script = await generateScript(textInput);
      const voicePath = await generateVoiceover(script);
      const captionsPath = await generateCaptions(script);
      const clips = await fetchStockClips(script);
      const finalVideoPath = await stitchVideo(clips, voicePath, captionsPath, logoPath, bgColor);

      const fileBuffer = fs.readFileSync(finalVideoPath);
      const { data, error } = await supabase.storage.from("videos").upload(`video-${Date.now()}.mp4`, fileBuffer);
      if (error) throw error;
      const publicURL = supabase.storage.from("videos").getPublicUrl(data.path).data.publicUrl;

      res.status(200).json({ url: publicURL });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Video generation failed" });
    }
  });
}
