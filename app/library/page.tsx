'use client';

import { useEffect } from "react";
import tracks from ".././data/tracks.json";
import { usePlayerStore } from "../store/usePlayerStore";

export default function Library() {
    const setTrack = usePlayerStore((state) => state.setTrack);
    const setPlaylist = usePlayerStore((state) => state.setPlaylist);
    
    useEffect(() => {
        setPlaylist(tracks); // loads tracks.json into global playlist
    }, []);

    return (
        <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Library</h1>
        <div className="space-y-2">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => setTrack(track)} // <-- HERE IT FIRES
              className="p-4 border rounded cursor-pointer hover:bg-gray-100"
            >
              <p className="font-semibold">{track.title}</p>
              <p className="text-sm text-gray-600">{track.artist}</p>
                </div>
            ))}
            </div>
        </main>
    )
}