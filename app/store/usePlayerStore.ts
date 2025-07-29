import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  artwork: string;
}

interface PlayerState {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  setTrack: (track: Track) => void;
  togglePlay: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  setTrack: (track) => set({ currentTrack: track }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
