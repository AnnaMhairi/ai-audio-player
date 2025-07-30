"use client"; 

import { usePlayerStore } from "../store/usePlayerStore";
import { useRef, useEffect } from "react";

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { currentTrack, isPlaying, togglePlay } = usePlayerStore();

    useEffect(() => {
        if (audioRef.current && currentTrack) {
            audioRef.current.src = currentTrack.url;
            audioRef.current.load();
            // auto play current track
            audioRef.current.play();
        }
    }, [currentTrack]);

    // Load new track when currentTrack changes
    useEffect(() => {
        if (audioRef.current && currentTrack) {
        audioRef.current.src = currentTrack.url;
        if (isPlaying) audioRef.current.play();
        }
    }, [currentTrack]);

    // Play/pause toggle
    useEffect(() => {
        if (!audioRef.current) return;
        isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }, [isPlaying]);

    if (!currentTrack) {
        return (
            <div className="p-4 border rounded bg-white shadow">
                <p className="text-gray-500">Select a track from the library</p>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
            <button
            onClick={togglePlay}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
        <div>
            <p className="font-semibold">{currentTrack.title}</p>
            <p className="text-sm text-gray-600">{currentTrack.artist}</p>
        </div>
        <audio ref={audioRef} />
      </div>
    )
}