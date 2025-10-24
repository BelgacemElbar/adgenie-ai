"use client";
import { useState } from "react";

export default function VideoForm() {
  const [textInput, setTextInput] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState("#000000");
  const [loading, setLoading] = useState(false);
  const [videoURL, setVideoURL] = useState("");

  const handleSubmit = async () => {
    if (!textInput) {
      alert("Please enter your video idea.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("textInput", textInput);
    formData.append("bgColor", bgColor);
    if (logoFile) formData.append("logo", logoFile);
    const res = await fetch("/api/generate-video", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setVideoURL(data.url);
    setLoading(false);
  };

  return (
    <div>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="Enter your video idea..."
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />
      <label className="block mb-2">
        Upload Logo (optional)
        <input
          type="file"
          accept="image/*"
          className="mt-1"
          onChange={(e) => {
            if (e.target.files) setLogoFile(e.target.files[0]);
          }}
        />
      </label>
      <label className="block mb-4">
        Branding Color
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="ml-2 w-10 h-10 p-0 border-0"
        />
      </label>
      <button
        className="w-full py-2 bg-blue-500 text-white rounded font-semibold"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Generating Video..." : "Generate Video"}
      </button>
      {videoURL && (
        <div className="mt-6">
          <video src={videoURL} controls className="w-full rounded" />
          <a href={videoURL} download className="block mt-2 text-blue-500 underline">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
