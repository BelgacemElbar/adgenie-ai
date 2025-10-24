import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateScript(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a professional copywriter generating short video scripts with hooks, CTAs, and hashtags for social media." },
      { role: "user", content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.8
  });
  return response.choices[0].message?.content || "Error generating script";
}
