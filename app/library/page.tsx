"use client";

import { useEffect } from "react";
import Image from "next/image";
import tracks from "./../data/tracks.json";
import { usePlayerStore } from "./../store/usePlayerStore";

export default function Library() {
  const setPlaylist = usePlayerStore((state) => state.setPlaylist);
  const setTrack = usePlayerStore((state) => state.setTrack);
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  useEffect(() => {
    setPlaylist(tracks); // initialize playlist when Library mounts
  }, [setPlaylist]);

  return (
    <main className="bg-[#121212] min-h-screen px-6 py-6">
      <h1 className="text-white text-3xl font-bold mb-6">Your Library</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => setTrack(track)}
            className={`bg-[#181818] p-4 rounded-lg cursor-pointer group hover:bg-[#282828] transition ${
              currentTrack?.id === track.id ? "ring-2 ring-green-500" : ""
            }`}
          >
            <div className="relative">
              <Image
                src={track.artwork || "/images/art1.jpg"}
                alt={track.title}
                width={200}
                height={200}
                className="rounded mb-3 object-cover"
              />
              {/* Play overlay button on hover */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition">
                <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center text-black text-lg shadow-lg hover:scale-105">
                  ▶
                </div>
              </div>
            </div>

            <div className="text-white font-semibold truncate">{track.title}</div>
            <div className="text-sm text-gray-400 truncate">{track.artist}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
