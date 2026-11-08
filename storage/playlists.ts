import AsyncStorage from '@react-native-async-storage/async-storage';

export type Playlist = {
  id: string;
  name: string;
  trackIds: string[];
};

const STORAGE_KEYS = {
  favorites: 'rocketmusic:favorites',
  playlists: 'rocketmusic:playlists',
  recentlyPlayed: 'rocketmusic:recently-played',
};

export async function getFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.favorites);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch (error) {
    console.warn('Unable to read favorites', error);
    return [];
  }
}

export async function getRecentlyPlayed(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.recentlyPlayed);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch (error) {
    console.warn('Unable to read recently played tracks', error);
    return [];
  }
}

export async function saveRecentlyPlayed(songIds: string[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.recentlyPlayed, JSON.stringify(songIds));
}

export async function saveFavorites(favorites: string[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
}

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.playlists);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item): Playlist[] => {
      if (typeof item !== 'object' || item === null) return [];
      const candidate = item as Partial<Playlist>;
      if (
        typeof candidate.id !== 'string' ||
        typeof candidate.name !== 'string' ||
        !Array.isArray(candidate.trackIds)
      ) {
        return [];
      }

      return [{
        id: candidate.id,
        name: candidate.name,
        trackIds: candidate.trackIds.filter((id): id is string => typeof id === 'string'),
      }];
    });
  } catch (error) {
    console.warn('Unable to read playlists', error);
    return [];
  }
}

export async function savePlaylists(playlists: Playlist[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(playlists));
}
