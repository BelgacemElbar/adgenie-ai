import fetch from "node-fetch";

type PexelsVideoFile = { quality?: string; link: string };
type PexelsVideo = { video_files: PexelsVideoFile[] };
type PexelsResponse = { videos?: PexelsVideo[] };

export async function fetchStockClips(query: string): Promise<string[]> {
  const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=3`, {
    headers: { Authorization: process.env.PEXELS_API_KEY! }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stock clips: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as PexelsResponse;
  const clips: string[] = [];

  for (const video of data.videos ?? []) {
    const clipUrl = video.video_files.find((file) => file.quality === "sd")?.link || video.video_files[0]?.link;
    if (clipUrl) clips.push(clipUrl);
  }

  return clips;
}
