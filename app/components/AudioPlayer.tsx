"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePlayerStore } from "../store/usePlayerStore";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    setTrack,
    playlist,
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Load new track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.pause();
    audio.src = currentTrack.url;
    audio.load();

    const handleCanPlay = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.warn("Auto-play blocked:", err);
      }
    };
    audio.addEventListener("canplay", handleCanPlay);
    return () => audio.removeEventListener("canplay", handleCanPlay);
  }, [currentTrack]);

  // Play/Pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Track progress + auto-advance
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => !isSeeking && setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", nextTrack);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", nextTrack);
    };
  }, [currentTrack, nextTrack, isSeeking]);

  // AI Tags + Recommendation
  useEffect(() => {
    if (!currentTrack) return;
    fetch("/api/ai/tags")
      .then((res) => res.json())
      .then((data) => setTags(data.tags));
    fetch("/api/ai/recommend")
      .then((res) => res.json())
      .then((data) => setRecommendation(data.message));
  }, [currentTrack]);

  if (!currentTrack) {
    return (
      <div className="p-4 text-gray-400 text-center bg-[#121212]">
        Select a track from the library
      </div>
    );
  }

  return (
    <div className="bg-[#181818] text-white flex flex-col md:flex-row md:items-center justify-between px-4 py-3 space-y-4 md:space-y-0 shadow-lg">
      {/* LEFT: Artwork + Track info */}
      <div className="flex items-center space-x-4 w-full md:w-1/3">
        <Image
          src={currentTrack.artwork || "/images/art1.jpg"}
          alt={currentTrack.title}
          width={64}
          height={64}
          className="rounded"
        />
        <div>
          <p className="font-semibold">{currentTrack.title}</p>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
          {tags.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-green-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Controls + progress bar */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="flex items-center space-x-6 mb-2">
          <button onClick={prevTrack} title="Previous" className="text-xl hover:text-green-500">
            ⏮
          </button>
          <button
            onClick={togglePlay}
            className="bg-green-500 text-black rounded-full w-12 h-12 flex items-center justify-center hover:scale-105 transition"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button onClick={nextTrack} title="Next" className="text-xl hover:text-green-500">
            ⏭
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center w-full space-x-2 text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={(e) => {
              setIsSeeking(false);
              const newTime = Number(e.currentTarget.value);
              setCurrentTime(newTime);
              if (audioRef.current) audioRef.current.currentTime = newTime;
            }}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full accent-green-500 cursor-pointer"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT: Recommendation */}
      <div className="w-full md:w-1/3 flex justify-center md:justify-end text-sm">
        {recommendation && (
          <div className="text-green-500">
            {recommendation}
          </div>
        )}
      </div>

      <audio ref={audioRef} preload="auto" />
    </div>
  );
}
