import { Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SongCard from '@/components/SongCard';
import { usePlayer } from '@/components/PlayerProvider';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { songs, favorites, playSong, toggleFavorite, playNext } = usePlayer();
  const [query, setQuery] = useState('');
  const filteredSongs = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return songs;

    return songs.filter((song) =>
      `${song.title} ${song.artist} ${song.album}`.toLocaleLowerCase().includes(term)
    );
  }, [query, songs]);

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
      <View style={styles.page}>
      <Text style={styles.eyebrow}>FIND THE RIGHT FREQUENCY</Text>
      <Text style={styles.title}>Search</Text>
      <View style={styles.searchBox}>
        <Search size={19} color="#A89EB5" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Songs, artists, albums..."
          placeholderTextColor="#777280"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search songs, artists, and albums"
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear search">
            <X size={17} color="#A89EB5" />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={filteredSongs}
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
          <Text style={styles.resultCount}>
            {query.trim() ? `${filteredSongs.length} ${filteredSongs.length === 1 ? 'result' : 'results'}` : 'Your local collection'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Search size={24} color="#C084FC" /></View>
            <Text style={styles.emptyTitle}>No matches this time</Text>
            <Text style={styles.emptyText}>Try a different title, artist, or album name.</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        windowSize={7}
        removeClippedSubviews
      />
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
    marginBottom: 17,
  },
  searchBox: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#15141B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#F6F3FA',
    fontSize: 13,
    paddingVertical: 0,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  resultCount: {
    color: '#898391',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 11,
  },
  emptyState: {
    flex: 1,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#251931',
  },
  emptyTitle: {
    color: '#F0ECF5',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14,
  },
  emptyText: {
    color: '#8F8998',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 5,
  },
});
