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

export const usePlayerStore = create((set) => ({
    playlist: [],
    currentIndex: 0,
    currentTrack: null,
    isPlaying: false,
    setPlaylist: (tracks) =>
        set(() => ({
          playlist: tracks,
          currentTrack: tracks.length > 0 ? tracks[0] : null,
          currentIndex: 0,
        })),
    setTrack: (track) =>
      set((state) => {
        const index = state.playlist.findIndex((t) => t.id === track.id);
        return { currentTrack: track, currentIndex: index, isPlaying: true };
      }),
    nextTrack: () =>
      set((state) => {
        const newIndex = (state.currentIndex + 1) % state.playlist.length;
        return {
          currentIndex: newIndex,
          currentTrack: state.playlist[newIndex],
          isPlaying: true,
        };
      }),
    prevTrack: () =>
      set((state) => {
        const newIndex =
          (state.currentIndex - 1 + state.playlist.length) %
          state.playlist.length;
        return {
          currentIndex: newIndex,
          currentTrack: state.playlist[newIndex],
          isPlaying: true,
        };
      }),
    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  }));
  
