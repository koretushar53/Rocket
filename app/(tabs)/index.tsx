import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Headphones, Play, Search, UserRound } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AlbumArtwork from '@/components/AlbumArtwork';
import PlaylistCard from '@/components/PlaylistCard';
import SongCard from '@/components/SongCard';
import { usePlayer } from '@/components/PlayerProvider';
import { songs } from '@/constants/music';

const moods = [
  { title: 'After hours', subtitle: 'A little louder after dark', songIds: ['dancin', 'end-of-beginning', 'on-the-floor'] },
  { title: 'Soft focus', subtitle: 'Stay in the moment', songIds: ['perfect', 'ilahi', 'zulfein'] },
  { title: 'Main character', subtitle: 'Your scene starts now', songIds: ['all-the-stars', 'am-i-dreaming', 'as-it-was'] },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { currentSong, favorites, recentlyPlayed, playQueue, playSong, playNext, toggleFavorite, playlists } = usePlayer();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();
  const recentSongs = recentlyPlayed
    .map((id) => songs.find((song) => song.id === id))
    .filter((song): song is (typeof songs)[number] => Boolean(song))
    .slice(0, 6);
  const trending = songs.filter((song) => song.featured || song.id === 'shape-of-you' || song.id === 'as-it-was');
  const curatedPlaylists = moods.map((mood) => ({
    id: mood.title,
    title: mood.title,
    subtitle: mood.subtitle,
    tracks: mood.songIds.map((id) => songs.find((song) => song.id === id)).filter((song): song is (typeof songs)[number] => Boolean(song)),
  }));
  const playlistCards = [
    ...playlists.map((playlist) => ({
      id: playlist.id,
      title: playlist.name,
      subtitle: `${playlist.trackIds.length} tracks · Your playlist`,
      tracks: playlist.trackIds.map((id) => songs.find((song) => song.id === id)).filter((song): song is (typeof songs)[number] => Boolean(song)),
    })),
    ...curatedPlaylists,
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 20) + 10 }]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>{today}</Text>
            <Text style={styles.greeting}>{greeting}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerButton}
              onPress={() => router.push('/search')}
              accessibilityRole="button"
              accessibilityLabel="Search your music"
            >
              <Search size={19} color="#F6F2FC" />
            </Pressable>
            <Pressable
              style={[styles.headerButton, styles.profileButton]}
              onPress={() => router.push('/library')}
              accessibilityRole="button"
              accessibilityLabel="Open your music library"
            >
              <UserRound size={18} color="#C084FC" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.intro}>Your collection, your frequency.</Text>

        <Pressable onPress={() => playSong(currentSong.id)} accessibilityRole="button">
          <LinearGradient
            colors={['#38135B', '#211331', '#17131E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroCopy}>
              <View style={styles.liveLabel}>
                <View style={styles.liveDot} />
                <Text style={styles.heroEyebrow}>PICK UP WHERE YOU LEFT OFF</Text>
              </View>
              <Text style={styles.heroTitle}>{currentSong.title}</Text>
              <Text style={styles.heroArtist}>{currentSong.artist}</Text>
              <View style={styles.playCta}>
                <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.playCtaText}>Play your music</Text>
              </View>
            </View>
            <View style={styles.heroArtwork}>
              <AlbumArtwork song={currentSong} size={126} radius={22} />
            </View>
            <Headphones size={142} color="rgba(255,255,255,0.055)" style={styles.heroWatermark} />
          </LinearGradient>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recently played</Text>
            <Text style={styles.sectionSubtitle}>Back to your favorite moments</Text>
          </View>
          <Pressable onPress={() => router.push('/library')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Open library">
            <ArrowRight size={19} color="#B867F4" />
          </Pressable>
        </View>

        {recentSongs.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
            {recentSongs.map((song) => (
              <Pressable key={song.id} onPress={() => playSong(song.id)} style={styles.recentCard}>
                <AlbumArtwork song={song} size={132} radius={20} />
                <Text style={styles.cardTitle} numberOfLines={1}>{song.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>{song.artist}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyRecent}>
            <Text style={styles.emptyRecentTitle}>Your next favorite starts here</Text>
            <Text style={styles.emptyRecentText}>Play a song and it will show up in your recent rotation.</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Made for your mood</Text>
            <Text style={styles.sectionSubtitle}>Small worlds, built from your own tracks</Text>
          </View>
          <Pressable onPress={() => router.push('/playlists')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Open playlists">
            <ArrowRight size={19} color="#B867F4" />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
          {playlistCards.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              title={playlist.title}
              subtitle={playlist.subtitle}
              songs={playlist.tracks}
              onPress={() => {
                if (playlist.tracks.length > 0) {
                  playQueue(playlist.tracks.map((song) => song.id));
                } else {
                  router.push('/playlists');
                }
              }}
            />
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Trending in your library</Text>
            <Text style={styles.sectionSubtitle}>Your most-played kind of energy</Text>
          </View>
          <Pressable onPress={() => router.push('/library')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Browse all songs">
            <ArrowRight size={19} color="#B867F4" />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
          {trending.map((song, index) => (
            <Pressable key={song.id} onPress={() => playSong(song.id)} style={styles.trendingCard}>
              <View style={styles.trendingArt}>
                <AlbumArtwork song={song} size={148} radius={22} />
                <View style={styles.rankBadge}><Text style={styles.rankText}>0{index + 1}</Text></View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>{song.title}</Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>{song.artist}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, styles.allSongsHeader]}>
          <View>
            <Text style={styles.sectionTitle}>All songs</Text>
            <Text style={styles.sectionSubtitle}>{songs.length} tracks stored on your device</Text>
          </View>
          <Pressable onPress={() => router.push('/library')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Open full library">
            <ArrowRight size={19} color="#B867F4" />
          </Pressable>
        </View>
        {songs.slice(0, 5).map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isFavorite={favorites.includes(song.id)}
            onPress={() => playSong(song.id)}
            onToggleFavorite={() => toggleFavorite(song.id)}
            onPlayNext={() => playNext(song.id)}
          />
        ))}
        <Pressable style={styles.seeAllButton} onPress={() => router.push('/library')}>
          <Text style={styles.seeAllText}>See all {songs.length} songs</Text>
          <ArrowRight size={15} color="#C084FC" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#08080D',
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    color: '#A39BAB',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
  },
  greeting: {
    color: '#F8F6FC',
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: 5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 9,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17151E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  profileButton: {
    backgroundColor: '#21152C',
    borderColor: 'rgba(168,85,247,0.24)',
  },
  intro: {
    color: '#908A99',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 21,
  },
  hero: {
    minHeight: 208,
    borderRadius: 25,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(213,176,255,0.16)',
    marginBottom: 30,
  },
  heroCopy: {
    flex: 1,
    zIndex: 2,
    paddingRight: 7,
  },
  liveLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D5A5FF',
  },
  heroEyebrow: {
    color: '#D8B5F8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 12,
    letterSpacing: -0.5,
  },
  heroArtist: {
    color: '#CDC2D6',
    fontSize: 11,
    marginTop: 4,
  },
  playCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 16,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#9333EA',
  },
  playCtaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  heroArtwork: {
    zIndex: 1,
    transform: [{ rotate: '5deg' }],
    shadowColor: '#B65CFF',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  heroWatermark: {
    position: 'absolute',
    right: -17,
    top: -18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 1,
  },
  sectionTitle: {
    color: '#F5F2F9',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.25,
  },
  sectionSubtitle: {
    color: '#85808E',
    fontSize: 10,
    marginTop: 4,
  },
  horizontal: {
    paddingRight: 12,
    paddingBottom: 28,
  },
  recentCard: {
    width: 132,
    marginRight: 13,
  },
  cardTitle: {
    color: '#F3F0F7',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 9,
  },
  cardSubtitle: {
    color: '#908B99',
    fontSize: 10,
    marginTop: 3,
  },
  emptyRecent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 27,
    borderRadius: 17,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  emptyRecentTitle: {
    color: '#E8E3ED',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyRecentText: {
    color: '#898391',
    fontSize: 11,
    marginTop: 5,
  },
  trendingCard: {
    width: 148,
    marginRight: 13,
  },
  trendingArt: {
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    left: 9,
    top: 9,
    width: 30,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: 'rgba(8,8,13,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  allSongsHeader: {
    marginTop: 0,
    marginBottom: 13,
  },
  seeAllButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: '#17131F',
  },
  seeAllText: {
    color: '#C084FC',
    fontSize: 11,
    fontWeight: '700',
  },
});
