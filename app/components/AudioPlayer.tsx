"use client"; 

import { useRef } from "react";

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }

    return (
        <div className="flex items-center space-x-4">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Play/Pause
        </button>
        <audio ref={audioRef} src="/audio/midnight-jam.mp3" />
      </div>
    )
}