import { router } from 'expo-router';
import { Pause, Play, SkipForward } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AlbumArtwork from '@/components/AlbumArtwork';
import { usePlayer, usePlayerStatus } from '@/components/PlayerProvider';

export default function PlayerFooter() {
  const { currentSong, togglePlay, nextSong } = usePlayer();
  const { currentTime, duration, isPlaying } = usePlayerStatus();
  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={styles.progressTrack}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
        <Pressable
          style={styles.track}
          onPress={() => router.push('/now-playing')}
          accessibilityRole="button"
          accessibilityLabel={`Now playing ${currentSong.title} by ${currentSong.artist}`}
        >
          <AlbumArtwork song={currentSong} size={44} radius={12} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{currentSong.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{currentSong.artist}</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={togglePlay}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          hitSlop={6}
        >
          {isPlaying ? <Pause size={18} color="#F8F5FF" fill="#F8F5FF" /> : <Play size={18} color="#F8F5FF" fill="#F8F5FF" />}
        </Pressable>
        <Pressable
          onPress={nextSong}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Next track"
          hitSlop={6}
        >
          <SkipForward size={19} color="#F8F5FF" fill="#F8F5FF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    backgroundColor: '#08080D',
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  bar: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 8,
    backgroundColor: '#15151D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  track: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    position: 'absolute',
    height: 2,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  progress: {
    height: 2,
    backgroundColor: '#A855F7',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: '#F9F7FF',
    fontSize: 13,
    fontWeight: '700',
  },
  artist: {
    color: '#A7A2B0',
    fontSize: 10,
    marginTop: 3,
  },
  iconButton: {
    width: 30,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
