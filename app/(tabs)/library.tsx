import { router } from 'expo-router';
import { ArrowDownUp, Disc3, ListMusic, Music2, Search, UsersRound, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AlbumArtwork from '@/components/AlbumArtwork';
import SongCard from '@/components/SongCard';
import { usePlayer } from '@/components/PlayerProvider';
import type { Song } from '@/constants/music';
import { songs } from '@/constants/music';

type LibrarySection = 'All songs' | 'Recently played' | 'Favorites' | 'Artists' | 'Albums' | 'Playlists';
type SortMode = 'title' | 'artist' | 'duration';

const sections: LibrarySection[] = ['All songs', 'Recently played', 'Favorites', 'Artists', 'Albums', 'Playlists'];
const sortLabels: Record<SortMode, string> = { title: 'Title', artist: 'Artist', duration: 'Duration' };

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, recentlyPlayed, playSong, playQueue, toggleFavorite, playNext } = usePlayer();
  const [section, setSection] = useState<LibrarySection>('All songs');
  const [sortMode, setSortMode] = useState<SortMode>('title');
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const sectionSongs = useMemo(() => {
    let result: Song[];
    if (section === 'Recently played') {
      result = recentlyPlayed
        .map((id) => songs.find((song) => song.id === id))
        .filter((song): song is Song => Boolean(song));
    } else if (section === 'Favorites') {
      result = songs.filter((song) => favorites.includes(song.id));
    } else {
      result = [...songs];
    }

    if (normalizedQuery) {
      result = result.filter((song) =>
        `${song.title} ${song.artist} ${song.album}`.toLocaleLowerCase().includes(normalizedQuery)
      );
    }

    return result.sort((first, second) => {
      if (sortMode === 'duration') return first.duration - second.duration;
      return first[sortMode].localeCompare(second[sortMode]);
    });
  }, [favorites, normalizedQuery, recentlyPlayed, section, sortMode]);

  const groupedSongs = useMemo(() => {
    const keyFor = section === 'Artists' ? 'artist' : 'album';
    const groups = new Map<string, Song[]>();
    const filteredSongs = normalizedQuery
      ? songs.filter((song) =>
        `${song.title} ${song.artist} ${song.album}`.toLocaleLowerCase().includes(normalizedQuery)
      )
      : songs;
    for (const song of filteredSongs) {
      const key = song[keyFor] || 'Unknown';
      groups.set(key, [...(groups.get(key) ?? []), song]);
    }
    return [...groups.entries()].sort(([first], [second]) => first.localeCompare(second));
  }, [normalizedQuery, section]);

  const cycleSort = () => {
    setSortMode((current) => current === 'title' ? 'artist' : current === 'artist' ? 'duration' : 'title');
  };

  const renderSections = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipScroll}
      contentContainerStyle={styles.chips}
    >
      {sections.map((item) => {
        const selected = section === item;
        return (
          <Pressable
            key={item}
            onPress={() => item === 'Playlists' ? router.push('/playlists') : setSection(item)}
            style={[styles.chip, selected && styles.activeChip]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.chipText, selected && styles.activeChipText]}>{item}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
      <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR MUSIC, ALL IN ONE PLACE</Text>
          <Text style={styles.title}>Your library</Text>
        </View>
        <Pressable onPress={cycleSort} style={styles.sortButton} accessibilityRole="button" accessibilityLabel={`Sort by ${sortLabels[sortMode]}`}>
          <ArrowDownUp size={15} color="#C084FC" />
          <Text style={styles.sortLabel}>{sortLabels[sortMode]}</Text>
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Search size={17} color="#938B9E" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search songs, artists, albums"
          placeholderTextColor="#756F7D"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search your library"
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear library search">
            <X size={15} color="#A89EB5" />
          </Pressable>
        ) : null}
      </View>

      {renderSections()}

      {section === 'Artists' || section === 'Albums' ? (
        <ScrollView contentContainerStyle={styles.groupList} showsVerticalScrollIndicator={false}>
          <Text style={styles.count}>{groupedSongs.length} {section.toLowerCase()}</Text>
          {groupedSongs.map(([name, tracks]) => (
            <Pressable
              key={name}
              onPress={() => playQueue(tracks.map((song) => song.id))}
              style={styles.groupCard}
              accessibilityRole="button"
            >
              <AlbumArtwork song={tracks[0]} size={58} radius={15} />
              <View style={styles.groupMeta}>
                <Text style={styles.groupTitle} numberOfLines={1}>{name}</Text>
                <Text style={styles.groupSubtitle}>{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}</Text>
              </View>
              {section === 'Artists' ? <UsersRound size={17} color="#8F8998" /> : <Disc3 size={18} color="#8F8998" />}
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <FlatList
          data={sectionSongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              isFavorite={favorites.includes(item.id)}
              onPress={() => playSong(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPlayNext={() => playNext(item.id)}
            />
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.listIcon}>
                {section === 'Favorites' ? <Music2 size={16} color="#C084FC" /> : <ListMusic size={16} color="#C084FC" />}
              </View>
              <Text style={styles.count}>
                {sectionSongs.length} {sectionSongs.length === 1 ? 'track' : 'tracks'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Music2 size={24} color="#76529A" />
              <Text style={styles.emptyTitle}>{section === 'Favorites' ? 'Your favorites live here' : 'Nothing here yet'}</Text>
              <Text style={styles.emptyText}>
                {section === 'Favorites'
                  ? 'Tap the heart on any track to save it.'
                  : 'Play a few tracks to start your listening history.'}
              </Text>
            </View>
          }
          contentContainerStyle={styles.songList}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          windowSize={7}
          removeClippedSubviews
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#08080D',
    paddingHorizontal: 18,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#A49CAB',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: '#F6F3FA',
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: 4,
  },
  searchBox: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 13,
    borderRadius: 15,
    backgroundColor: '#14131A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 13,
  },
  searchInput: {
    flex: 1,
    color: '#F6F3FA',
    fontSize: 12,
    paddingVertical: 0,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#15131B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 3,
  },
  sortLabel: {
    color: '#C4BCCD',
    fontSize: 10,
    fontWeight: '700',
  },
  chips: {
    alignItems: 'center',
    gap: 8,
    paddingRight: 10,
  },
  chipScroll: {
    height: 43,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 13,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: '#14131A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  activeChip: {
    backgroundColor: '#30203D',
    borderColor: 'rgba(192,132,252,0.45)',
  },
  chipText: {
    color: '#A39EAA',
    fontSize: 10,
    fontWeight: '700',
  },
  activeChipText: {
    color: '#E4C9FF',
  },
  songList: {
    paddingBottom: 25,
    flexGrow: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  listIcon: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#21172C',
  },
  count: {
    color: '#85808E',
    fontSize: 10,
    fontWeight: '600',
  },
  groupList: {
    paddingBottom: 25,
  },
  groupCard: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.055)',
  },
  groupMeta: {
    flex: 1,
    marginHorizontal: 12,
  },
  groupTitle: {
    color: '#F3F0F7',
    fontSize: 13,
    fontWeight: '700',
  },
  groupSubtitle: {
    color: '#898391',
    fontSize: 10,
    marginTop: 4,
  },
  empty: {
    flex: 1,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#EEE9F4',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 13,
  },
  emptyText: {
    color: '#8F8998',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 5,
  },
});
