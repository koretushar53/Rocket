import { LinearGradient } from 'expo-linear-gradient';
import { Music2, Sparkles } from 'lucide-react-native';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { Song } from '@/constants/music';

type AlbumArtworkProps = {
  song: Song;
  size: number;
  radius?: number;
};

export default function AlbumArtwork({ song, size, radius = size * 0.18 }: AlbumArtworkProps) {
  const compact = size < 84;

  return (
    <LinearGradient
      colors={[song.accent, '#17121F', '#0B0A10']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.artwork, { width: size, height: size, borderRadius: radius }]}
    >
      {song.cover ? (
        <>
          <Image
            source={song.cover}
            resizeMode="cover"
            style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          />
          {!compact ? (
            <LinearGradient
              colors={['rgba(8,8,13,0.08)', 'rgba(8,8,13,0.12)', 'rgba(8,8,13,0.82)']}
              locations={[0, 0.48, 1]}
              style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
            />
          ) : null}
        </>
      ) : null}
      <View style={[styles.orbit, { width: size * 0.78, height: size * 0.78, borderRadius: size }]}>
        <View style={[styles.innerOrbit, { width: size * 0.55, height: size * 0.55, borderRadius: size }]}>
          <View style={[styles.center, { width: size * 0.2, height: size * 0.2, borderRadius: size }]}>
            <Music2 size={compact ? 12 : size * 0.12} color="#FFFFFF" />
          </View>
        </View>
      </View>
      {!compact ? (
        <View style={styles.copy}>
          <View style={styles.topline}>
            <Sparkles size={size * 0.075} color="rgba(255,255,255,0.8)" />
            <Text style={[styles.overline, { fontSize: Math.max(7, size * 0.035) }]}>ROCKET · SOUND</Text>
          </View>
          <Text style={[styles.title, { fontSize: Math.max(13, size * 0.11) }]} numberOfLines={2}>
            {song.title}
          </Text>
          <Text style={[styles.artist, { fontSize: Math.max(8, size * 0.05) }]} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
      ) : null}
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          { width: size * 0.8, height: size * 0.8, top: -size * 0.24, right: -size * 0.25 },
        ]}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  artwork: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  orbit: {
    position: 'absolute',
    right: -14,
    top: -18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  innerOrbit: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(8,8,13,0.34)',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.17)',
  },
  copy: {
    position: 'absolute',
    left: '9%',
    right: '8%',
    bottom: '9%',
  },
  topline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  overline: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 8,
  },
  artist: {
    color: 'rgba(255,255,255,0.76)',
    marginTop: 4,
    fontWeight: '600',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
