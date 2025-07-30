"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../store/usePlayerStore";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Utility: format time into mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Load new track when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.pause();
    audio.src = currentTrack.url;
    audio.load();

    // Auto-play when track is ready
    const handleCanPlay = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.warn("Auto-play was blocked:", err);
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    return () => audio.removeEventListener("canplay", handleCanPlay);
  }, [currentTrack]);

  // Toggle play/pause manually when isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {}); // Ignore play() race conditions
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Track progress, duration, and auto-advance on end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };
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

  // Show placeholder if no track selected
  if (!currentTrack) {
    return (
      <div className="p-4 border rounded bg-white shadow">
        <p className="text-gray-500">Select a track from the library</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 bg-white shadow-md p-4 rounded">
      {/* Controls */}
      <div className="flex items-center space-x-4 justify-center">
        <button
          onClick={prevTrack}
          className="text-xl hover:text-blue-500"
          title="Previous Track"
        >
          ⏮
        </button>
        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={nextTrack}
          className="text-xl hover:text-blue-500"
          title="Next Track"
        >
          ⏭
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full space-y-1">
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
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Track info */}
      <div className="text-center">
        <p className="font-semibold">{currentTrack.title}</p>
        <p className="text-sm text-gray-600">{currentTrack.artist}</p>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}
