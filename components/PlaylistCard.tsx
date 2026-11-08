import { LinearGradient } from 'expo-linear-gradient';
import { Music2, Play } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AlbumArtwork from '@/components/AlbumArtwork';
import type { Song } from '@/constants/music';

type PlaylistCardProps = {
  title: string;
  subtitle: string;
  songs: Song[];
  onPress?: () => void;
};

export default function PlaylistCard({ title, subtitle, songs, onPress }: PlaylistCardProps) {
  const covers = songs.slice(0, 3);

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      <LinearGradient colors={['#21172C', '#14121A']} style={styles.coverPanel}>
        {covers.length > 0 ? (
          <View style={styles.artworkRow}>
            {covers.map((song, index) => (
              <View key={song.id} style={[styles.artwork, { zIndex: covers.length - index, marginLeft: index === 0 ? 0 : -16 }]}>
                <AlbumArtwork song={song} size={68} radius={14} />
              </View>
            ))}
          </View>
        ) : (
          <Music2 size={32} color="#A855F7" />
        )}
        <View style={styles.playButton}>
          <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
        </View>
      </LinearGradient>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 184,
    marginRight: 12,
  },
  coverPanel: {
    height: 116,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  artworkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    borderRadius: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  playButton: {
    position: 'absolute',
    right: 9,
    bottom: 9,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9333EA',
    shadowColor: '#9333EA',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    color: '#F3F0F7',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 9,
  },
  subtitle: {
    color: '#8E8996',
    fontSize: 10,
    marginTop: 3,
  },
});
