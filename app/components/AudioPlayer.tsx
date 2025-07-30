"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/usePlayerStore";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();

  // Load a new track when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Stop and reset before loading the new source
    audio.pause();
    audio.src = currentTrack.url;
    audio.load();

    // Auto-play once the browser confirms it's ready
    const handleCanPlay = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.warn("Auto-play was blocked:", err);
      }
    };

    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentTrack]);

  // Toggle play/pause manually when the user hits the button
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio
        .play()
        .catch((err) => console.warn("Play error:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  if (!currentTrack) {
    return (
      <div className="p-4 border rounded bg-white shadow">
        <p className="text-gray-500">Select a track from the library</p>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 bg-white shadow-md p-4 rounded">
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div>
        <p className="font-semibold">{currentTrack.title}</p>
        <p className="text-sm text-gray-600">{currentTrack.artist}</p>
      </div>
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}
