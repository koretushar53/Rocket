import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowDown,
  Heart,
  ListMusic,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import AlbumArtwork from '@/components/AlbumArtwork';
import MusicProgressBar from '@/components/MusicProgressBar';
import { usePlayer, usePlayerStatus } from '@/components/PlayerProvider';

function VisualizerBar({ index, playing }: { index: number; playing: boolean }) {
  const height = useSharedValue(5);

  useEffect(() => {
    height.value = withRepeat(
      withTiming(playing ? 8 + ((index * 13) % 17) : 5, {
        duration: 300 + ((index * 47) % 450),
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    return () => cancelAnimation(height);
  }, [height, index, playing]);

  const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));
  return <Animated.View style={[styles.visualizerBar, animatedStyle]} />;
}

export default function NowPlayingScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const {
    currentSong,
    togglePlay,
    previousSong,
    nextSong,
    seekTo,
    setVolume,
    toggleFavorite,
    favorites,
    shuffle,
    repeatMode,
    setShuffle,
    setRepeatMode,
  } = usePlayer();
  const { currentTime, duration, volume, isPlaying } = usePlayerStatus();
  const rotation = useSharedValue(0);
  const [volumeWidth, setVolumeWidth] = useState(0);
  const [lastVolume, setLastVolume] = useState(0.7);
  const isFavorite = favorites.includes(currentSong.id);
  const discSize = Math.min(width - 72, 330);

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 15000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
    }

    return () => cancelAnimation(rotation);
  }, [isPlaying, rotation]);

  const discStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume || 0.7);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#21132E', '#0E0D14', '#08080D']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 16) + 7,
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.topButton}
            accessibilityRole="button"
            accessibilityLabel="Minimize player"
          >
            <ArrowDown size={20} color="#F6F2FA" />
          </Pressable>
          <View style={styles.topTitle}>
            <Text style={styles.topEyebrow}>NOW PLAYING</Text>
            <Text style={styles.topSubheading}>From your library</Text>
          </View>
          <Pressable
            onPress={() => router.push('/modal')}
            style={styles.topButton}
            accessibilityRole="button"
            accessibilityLabel="Open play queue"
          >
            <ListMusic size={19} color="#F6F2FA" />
          </Pressable>
        </View>

        <View style={styles.artSection}>
          <Animated.View style={[styles.vinyl, { width: discSize, height: discSize, borderRadius: discSize / 2 }, discStyle]}>
            <View style={[styles.groove, { width: discSize * 0.91, height: discSize * 0.91, borderRadius: discSize }]}>
              <View style={[styles.groove, { width: discSize * 0.77, height: discSize * 0.77, borderRadius: discSize }]}>
                <View style={[styles.groove, { width: discSize * 0.64, height: discSize * 0.64, borderRadius: discSize }]}>
                  <AlbumArtwork song={currentSong} size={discSize * 0.56} radius={discSize * 0.28} />
                </View>
              </View>
            </View>
            <View style={styles.vinylShine} />
          </Animated.View>
          <View style={[styles.discGlow, { width: discSize * 0.76, height: 24 }]} />
        </View>

        <View style={styles.trackInfo}>
          <View style={styles.trackCopy}>
            <Text style={styles.trackTitle} numberOfLines={1}>{currentSong.title}</Text>
            <Text style={styles.trackArtist} numberOfLines={1}>{currentSong.artist} · {currentSong.album}</Text>
          </View>
          <Pressable
            onPress={() => toggleFavorite(currentSong.id)}
            style={styles.favoriteButton}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={23} color={isFavorite ? '#D690FF' : '#A49CAB'} fill={isFavorite ? '#D690FF' : 'transparent'} />
          </Pressable>
        </View>

        <View style={styles.visualizer}>
          {Array.from({ length: 19 }, (_, index) => (
            <VisualizerBar key={index} index={index} playing={isPlaying} />
          ))}
        </View>

        <MusicProgressBar currentTime={currentTime} duration={duration} onSeek={seekTo} />

        <View style={styles.controls}>
          <Pressable
            onPress={() => setShuffle(!shuffle)}
            style={styles.sideControl}
            accessibilityRole="button"
            accessibilityLabel={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <Shuffle size={20} color={shuffle ? '#D4A1FF' : '#928C99'} />
            {shuffle ? <View style={styles.activeDot} /> : null}
          </Pressable>
          <Pressable onPress={previousSong} style={styles.skipButton} accessibilityRole="button" accessibilityLabel="Previous track">
            <SkipBack size={27} color="#F5F1F9" fill="#F5F1F9" />
          </Pressable>
          <Pressable onPress={togglePlay} style={styles.playButton} accessibilityRole="button" accessibilityLabel={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <View style={styles.pauseIcon}><View style={styles.pauseBar} /><View style={styles.pauseBar} /></View> : <View style={styles.playIcon} />}
          </Pressable>
          <Pressable onPress={nextSong} style={styles.skipButton} accessibilityRole="button" accessibilityLabel="Next track">
            <SkipForward size={27} color="#F5F1F9" fill="#F5F1F9" />
          </Pressable>
          <Pressable
            onPress={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
            style={styles.sideControl}
            accessibilityRole="button"
            accessibilityLabel={`Repeat ${repeatMode}`}
          >
            <Repeat size={20} color={repeatMode === 'off' ? '#928C99' : '#D4A1FF'} />
            {repeatMode === 'one' ? <Text style={styles.repeatOne}>1</Text> : null}
            {repeatMode === 'all' ? <View style={styles.activeDot} /> : null}
          </Pressable>
        </View>

        <View style={styles.volumeRow}>
          <Pressable onPress={toggleMute} accessibilityRole="button" accessibilityLabel={volume === 0 ? 'Unmute' : 'Mute'}>
            {volume === 0 ? <VolumeX size={17} color="#8F8997" /> : volume < 0.5 ? <Volume1 size={17} color="#8F8997" /> : <Volume2 size={17} color="#8F8997" />}
          </Pressable>
          <Pressable
            style={styles.volumeTrack}
            onLayout={(event) => setVolumeWidth(event.nativeEvent.layout.width)}
            onPress={(event) => {
              if (volumeWidth > 0) setVolume(event.nativeEvent.locationX / volumeWidth);
            }}
            accessibilityRole="adjustable"
            accessibilityLabel="Volume"
            accessibilityValue={{ min: 0, max: 100, now: Math.round(volume * 100) }}
          >
            <View style={[styles.volumeFill, { width: `${Math.min(volume * 100, 100)}%` }]} />
          </Pressable>
          <Text style={styles.volumeLabel}>{Math.round(volume * 100)}%</Text>
        </View>

        <Pressable style={styles.queueLink} onPress={() => router.push('/modal')} accessibilityRole="button">
          <ListMusic size={16} color="#C084FC" />
          <Text style={styles.queueLinkText}>Manage play queue</Text>
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
    maxWidth: 500,
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: 26,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  topTitle: {
    alignItems: 'center',
  },
  topEyebrow: {
    color: '#E8E1ED',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.7,
  },
  topSubheading: {
    color: '#817B89',
    fontSize: 9,
    marginTop: 4,
  },
  artSection: {
    flex: 1,
    minHeight: 295,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  vinyl: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111116',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#8D32CB',
    shadowOpacity: 0.25,
    shadowRadius: 35,
    elevation: 18,
  },
  groove: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.012)',
  },
  vinylShine: {
    position: 'absolute',
    top: '12%',
    left: '18%',
    width: '30%',
    height: '5%',
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.11)',
    transform: [{ rotate: '-35deg' }],
  },
  discGlow: {
    position: 'absolute',
    bottom: 10,
    borderRadius: 99,
    backgroundColor: 'rgba(151,57,223,0.17)',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 19,
  },
  trackCopy: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    color: '#FBF9FD',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  trackArtist: {
    color: '#A49DAB',
    fontSize: 12,
    marginTop: 6,
  },
  favoriteButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualizer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
    marginBottom: 8,
  },
  visualizerBar: {
    width: 3,
    borderRadius: 99,
    backgroundColor: '#B762F5',
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  sideControl: {
    width: 39,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  skipButton: {
    width: 44,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    backgroundColor: '#F6F0FC',
    shadowColor: '#B256F4',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  playIcon: {
    width: 0,
    height: 0,
    marginLeft: 5,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#23172D',
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 5,
  },
  pauseBar: {
    width: 6,
    height: 22,
    borderRadius: 2,
    backgroundColor: '#23172D',
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D5A2FF',
  },
  repeatOne: {
    position: 'absolute',
    top: 5,
    right: 4,
    color: '#D5A2FF',
    fontSize: 8,
    fontWeight: '900',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginTop: 25,
  },
  volumeTrack: {
    flex: 1,
    height: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.13)',
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#C084FC',
  },
  volumeLabel: {
    minWidth: 30,
    color: '#8E8896',
    fontSize: 9,
    textAlign: 'right',
  },
  queueLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    marginTop: 9,
  },
  queueLinkText: {
    color: '#C7B4D9',
    fontSize: 10,
    fontWeight: '700',
  },
});
