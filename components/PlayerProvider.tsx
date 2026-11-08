import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { songs, type Song } from '@/constants/music';
import {
  getFavorites,
  getPlaylists,
  getRecentlyPlayed,
  saveFavorites,
  savePlaylists,
  saveRecentlyPlayed,
  type Playlist,
} from '@/storage/playlists';
import { useClientOnlyValue } from './useClientOnlyValue';

export type RepeatMode = 'off' | 'all' | 'one';

function setRepeatOne(player: AudioPlayer, repeatMode: RepeatMode) {
  player.loop = repeatMode === 'one';
}

function setPlayerVolume(player: AudioPlayer, volume: number) {
  player.volume = volume;
}

type PlayerContextValue = {
  songs: Song[];
  currentSong: Song;
  shuffle: boolean;
  repeatMode: RepeatMode;
  favorites: string[];
  recentlyPlayed: string[];
  queue: string[];
  playlists: Playlist[];
  playSong: (songId: string) => void;
  playQueue: (songIds: string[]) => void;
  togglePlay: () => void;
  previousSong: () => void;
  nextSong: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleFavorite: (songId: string) => void;
  playNext: (songId: string) => void;
  replaceQueue: (songIds: string[]) => void;
  removeFromQueue: (songId: string) => void;
  moveQueueSong: (songId: string, direction: -1 | 1) => void;
  clearQueue: () => void;
  createPlaylist: (name: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  setShuffle: (value: boolean) => void;
  setRepeatMode: (mode: RepeatMode) => void;
};

type PlayerStatusValue = {
  currentTime: number;
  duration: number;
  volume: number;
  isPlaying: boolean;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);
const PlayerStatusContext = createContext<PlayerStatusValue | undefined>(undefined);

const fallbackValue: PlayerContextValue = {
  songs,
  currentSong: songs[0],
  shuffle: false,
  repeatMode: 'off',
  favorites: [],
  recentlyPlayed: [],
  queue: songs.map((song) => song.id),
  playlists: [],
  playSong: () => undefined,
  playQueue: () => undefined,
  togglePlay: () => undefined,
  previousSong: () => undefined,
  nextSong: () => undefined,
  seekTo: () => undefined,
  setVolume: () => undefined,
  toggleFavorite: () => undefined,
  playNext: () => undefined,
  replaceQueue: () => undefined,
  removeFromQueue: () => undefined,
  moveQueueSong: () => undefined,
  clearQueue: () => undefined,
  createPlaylist: () => undefined,
  addSongToPlaylist: () => undefined,
  removeSongFromPlaylist: () => undefined,
  deletePlaylist: () => undefined,
  setShuffle: () => undefined,
  setRepeatMode: () => undefined,
};

const fallbackStatus: PlayerStatusValue = {
  currentTime: 0,
  duration: 0,
  volume: 1,
  isPlaying: false,
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const isClient = useClientOnlyValue(false, true);

  if (!isClient) {
    return (
      <PlayerContext.Provider value={fallbackValue}>
        <PlayerStatusContext.Provider value={fallbackStatus}>{children}</PlayerStatusContext.Provider>
      </PlayerContext.Provider>
    );
  }

  return <AudioPlayerProvider>{children}</AudioPlayerProvider>;
}

function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const player = useAudioPlayer(songs[0].file, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>(() => songs.map((song) => song.id));
  const [currentSongId, setCurrentSongId] = useState<string>(songs[0].id);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>('off');
  const [volume, setVolumeState] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const handledFinish = useRef(false);

  useEffect(() => {
    void setAudioModeAsync({
      shouldPlayInBackground: true,
      playsInSilentMode: true,
      interruptionMode: 'doNotMix',
      interruptionModeAndroid: 'doNotMix',
    }).catch((error: unknown) => {
      console.error('Unable to configure background audio playback', error);
    });

    return () => {
      player.setActiveForLockScreen(false);
    };
  }, [player]);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      const [savedFavorites, savedPlaylists, savedHistory] = await Promise.all([
        getFavorites(),
        getPlaylists(),
        getRecentlyPlayed(),
      ]);
      if (!active) return;
      const validFavorites = savedFavorites.filter((id) => songs.some((song) => song.id === id));
      const validHistory = savedHistory.filter((id) => songs.some((song) => song.id === id));
      setFavorites((current) => [...new Set([...validFavorites, ...current])]);
      setPlaylists((current) => {
        const currentIds = new Set(current.map((playlist) => playlist.id));
        return [...current, ...savedPlaylists.filter((playlist) => !currentIds.has(playlist.id))];
      });
      setRecentlyPlayed((current) =>
        [...new Set([...current, ...validHistory])].slice(0, 30)
      );
      setHydrated(true);
    }

    void hydrate();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void saveFavorites(favorites).catch((error: unknown) => {
      console.error('Unable to save favorite tracks', error);
    });
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    void savePlaylists(playlists).catch((error: unknown) => {
      console.error('Unable to save playlists', error);
    });
  }, [playlists, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    void saveRecentlyPlayed(recentlyPlayed).catch((error: unknown) => {
      console.error('Unable to save recently played tracks', error);
    });
  }, [recentlyPlayed, hydrated]);

  const currentSong = useMemo(
    () => songs.find((song) => song.id === currentSongId) ?? songs[0],
    [currentSongId]
  );

  const markRecentlyPlayed = useCallback((songId: string) => {
    setRecentlyPlayed((current) => [songId, ...current.filter((id) => id !== songId)].slice(0, 30));
  }, []);

  const playSong = useCallback((songId: string) => {
    const song = songs.find((item) => item.id === songId);
    if (!song) return;

    setCurrentSongId(song.id);
    setQueue((current) => current.includes(songId) ? current : [...current, songId]);
    markRecentlyPlayed(song.id);
    player.replace(song.file);
    player.play();
    player.setActiveForLockScreen(true, {
      title: song.title,
      artist: song.artist,
      albumTitle: song.album,
    });
  }, [markRecentlyPlayed, player]);

  const playQueue = useCallback((songIds: string[]) => {
    const nextQueue = [...new Set(songIds)].filter((id) => songs.some((song) => song.id === id));
    if (nextQueue.length === 0) return;
    setQueue(nextQueue);
    playSong(nextQueue[0]);
  }, [playSong]);

  const nextSong = useCallback(() => {
    const playableQueue = queue;
    if (playableQueue.length === 0) {
      player.pause();
      return;
    }
    const currentIndex = playableQueue.indexOf(currentSongId);

    if (shuffle && playableQueue.length > 1) {
      const candidates = playableQueue.filter((id) => id !== currentSongId);
      const randomSongId = candidates[Math.floor(Math.random() * candidates.length)];
      playSong(randomSongId);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < playableQueue.length) {
      playSong(playableQueue[nextIndex]);
    } else if (repeatMode === 'all') {
      playSong(playableQueue[0]);
    } else {
      player.pause();
    }
  }, [currentSongId, player, playSong, queue, repeatMode, shuffle]);

  const previousSong = useCallback(() => {
    if (status.currentTime > 3) {
      void player.seekTo(0).catch((error: unknown) => {
        console.error('Unable to restart the current track', error);
      });
      return;
    }

    const playableQueue = queue;
    if (playableQueue.length === 0) {
      void player.seekTo(0).catch((error: unknown) => {
        console.error('Unable to restart the current track', error);
      });
      return;
    }
    const currentIndex = playableQueue.indexOf(currentSongId);
    if (shuffle && playableQueue.length > 1) {
      const candidates = playableQueue.filter((id) => id !== currentSongId);
      playSong(candidates[Math.floor(Math.random() * candidates.length)]);
      return;
    }

    if (currentIndex > 0) {
      playSong(playableQueue[currentIndex - 1]);
    } else if (repeatMode === 'all') {
      playSong(playableQueue[playableQueue.length - 1]);
    } else {
      void player.seekTo(0).catch((error: unknown) => {
        console.error('Unable to restart the current track', error);
      });
    }
  }, [currentSongId, player, playSong, queue, repeatMode, shuffle, status.currentTime]);

  const togglePlay = useCallback(() => {
    if (status.playing) {
      player.pause();
      return;
    }
    player.play();
    player.setActiveForLockScreen(true, {
      title: currentSong.title,
      artist: currentSong.artist,
      albumTitle: currentSong.album,
    });
  }, [currentSong, player, status.playing]);

  useEffect(() => {
    setRepeatOne(player, repeatMode);
  }, [player, repeatMode]);

  useEffect(() => {
    if (!status.didJustFinish) {
      handledFinish.current = false;
      return;
    }
    if (handledFinish.current || repeatMode === 'one') return;
    handledFinish.current = true;
    nextSong();
  }, [nextSong, repeatMode, status.didJustFinish]);

  const seekTo = useCallback((seconds: number) => {
    const duration = Number.isFinite(status.duration) && status.duration > 0
      ? status.duration
      : currentSong.duration;
    if (!Number.isFinite(seconds) || !Number.isFinite(duration) || duration <= 0) {
      console.error('Unable to seek in the current track: invalid position or duration.');
      return;
    }

    void player.seekTo(Math.max(0, Math.min(seconds, duration))).catch((error: unknown) => {
      console.error('Unable to seek in the current track', error);
    });
  }, [currentSong.duration, player, status.duration]);

  const setVolume = useCallback((volume: number) => {
    const nextVolume = Math.max(0, Math.min(volume, 1));
    setPlayerVolume(player, nextVolume);
    setVolumeState(nextVolume);
  }, [player]);

  const toggleFavorite = useCallback((songId: string) => {
    setFavorites((current) => current.includes(songId)
      ? current.filter((id) => id !== songId)
      : [...current, songId]);
  }, []);

  const playNext = useCallback((songId: string) => {
    if (!songs.some((song) => song.id === songId)) return;
    setQueue((current) => {
      if (songId === currentSongId) return current;
      const withoutSong = current.filter((id) => id !== songId);
      const currentIndex = withoutSong.indexOf(currentSongId);
      const insertAt = currentIndex < 0 ? 0 : currentIndex + 1;
      return [...withoutSong.slice(0, insertAt), songId, ...withoutSong.slice(insertAt)];
    });
  }, [currentSongId]);

  const removeFromQueue = useCallback((songId: string) => {
    setQueue((current) => current.filter((id) => id !== songId));
  }, []);

  const replaceQueue = useCallback((songIds: string[]) => {
    setQueue([...new Set(songIds)].filter((id) => songs.some((song) => song.id === id)));
  }, []);

  const moveQueueSong = useCallback((songId: string, direction: -1 | 1) => {
    setQueue((current) => {
      const index = current.indexOf(songId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const createPlaylist = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlaylists((current) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: trimmed, trackIds: [] },
      ...current,
    ]);
  }, []);

  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((current) => current.map((item) => {
      if (item.id !== playlistId || item.trackIds.includes(songId)) return item;
      return { ...item, trackIds: [...item.trackIds, songId] };
    }));
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((current) => current.map((item) => item.id === playlistId
      ? { ...item, trackIds: item.trackIds.filter((id) => id !== songId) }
      : item));
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists((current) => current.filter((item) => item.id !== playlistId));
  }, []);

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    setRepeatModeState(mode);
  }, []);

  const value = useMemo(() => ({
    songs,
    currentSong,
    shuffle,
    repeatMode,
    favorites,
    recentlyPlayed,
    queue,
    playlists,
    playSong,
    playQueue,
    togglePlay,
    previousSong,
    nextSong,
    seekTo,
    setVolume,
    toggleFavorite,
    playNext,
    replaceQueue,
    removeFromQueue,
    moveQueueSong,
    clearQueue,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    setShuffle,
    setRepeatMode,
  }), [
    currentSong,
    shuffle,
    repeatMode,
    favorites,
    recentlyPlayed,
    queue,
    playlists,
    playSong,
    playQueue,
    togglePlay,
    previousSong,
    nextSong,
    seekTo,
    setVolume,
    toggleFavorite,
    playNext,
    replaceQueue,
    removeFromQueue,
    moveQueueSong,
    clearQueue,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    setShuffle,
    setRepeatMode,
  ]) satisfies PlayerContextValue;
  const playbackStatus = useMemo(() => ({
    currentTime: status.currentTime,
    duration: status.duration || currentSong.duration,
    volume,
    isPlaying: status.playing,
  }), [currentSong.duration, status.currentTime, status.duration, status.playing, volume]);

  return (
    <PlayerContext.Provider value={value}>
      <PlayerStatusContext.Provider value={playbackStatus}>{children}</PlayerStatusContext.Provider>
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used inside PlayerProvider');
  }
  return context;
}

export function usePlayerStatus() {
  const context = useContext(PlayerStatusContext);
  if (!context) {
    throw new Error('usePlayerStatus must be used inside PlayerProvider');
  }
  return context;
}
