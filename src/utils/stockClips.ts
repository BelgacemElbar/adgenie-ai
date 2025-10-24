import fetch from "node-fetch";

export async function fetchStockClips(query: string): Promise<string[]> {
  const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=3`, {
    headers: { Authorization: process.env.PEXELS_API_KEY! }
  });

  const data = await response.json();
  const clips: string[] = [];

  for (const video of data.videos) {
    const clipUrl = video.video_files.find((f: any) => f.quality === "sd")?.link || video.video_files[0]?.link;
    if (clipUrl) clips.push(clipUrl);
  }

  return clips;
}
