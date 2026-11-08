import { Heart, MoreVertical } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import AlbumArtwork from '@/components/AlbumArtwork';
import { formatDuration, type Song } from '@/constants/music';

type SongCardProps = {
  song: Song;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  onPlayNext?: () => void;
};

export default function SongCard({
  song,
  isFavorite,
  onPress,
  onToggleFavorite,
  onPlayNext,
}: SongCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <View style={styles.card}>
        <Pressable style={styles.main} onPress={onPress} accessibilityRole="button">
          <AlbumArtwork song={song} size={54} radius={14} />
          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{song.artist}</Text>
            <Text style={styles.album} numberOfLines={1}>{song.album}</Text>
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
          <Pressable
            onPress={onToggleFavorite}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`}
            hitSlop={8}
          >
            <Heart size={19} color={isFavorite ? '#C084FC' : '#A99FB6'} fill={isFavorite ? '#C084FC' : 'transparent'} />
          </Pressable>
          <Pressable
            onPress={() => setMenuVisible(true)}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={`More actions for ${song.title}`}
            hitSlop={8}
          >
            <MoreVertical size={19} color="#A99FB6" />
          </Pressable>
        </View>

        <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={closeMenu}>
          <View style={styles.menuOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} accessibilityRole="button" accessibilityLabel="Close song actions" />
            <View style={styles.menuCard}>
              <Text style={styles.menuTitle} numberOfLines={1}>{song.title}</Text>
              <Text style={styles.menuSubtitle} numberOfLines={1}>{song.artist}</Text>
              {onPlayNext ? (
                <Pressable
                  onPress={() => {
                    closeMenu();
                    onPlayNext();
                  }}
                  style={styles.menuAction}
                  accessibilityRole="button"
                >
                  <Text style={styles.menuActionText}>Play next</Text>
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => {
                  closeMenu();
                  onToggleFavorite();
                }}
                style={styles.menuAction}
                accessibilityRole="button"
              >
                <Text style={styles.menuActionText}>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
              </Pressable>
              <Pressable onPress={closeMenu} style={styles.menuCancel} accessibilityRole="button">
                <Text style={styles.menuCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.055)',
    backgroundColor: '#111118',
  },
  main: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },
  title: {
    color: '#F6F4FA',
    fontSize: 14,
    fontWeight: '700',
  },
  artist: {
    color: '#A8A3B2',
    fontSize: 11,
    marginTop: 3,
  },
  album: {
    color: '#716B7C',
    fontSize: 10,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingLeft: 8,
  },
  duration: {
    color: '#8E8998',
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
  actionButton: {
    width: 30,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  menuCard: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#1A1821',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  menuTitle: {
    color: '#F6F3FA',
    fontSize: 15,
    fontWeight: '700',
  },
  menuSubtitle: {
    color: '#9B95A4',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 10,
  },
  menuAction: {
    minHeight: 44,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  menuActionText: {
    color: '#E8E3ED',
    fontSize: 13,
    fontWeight: '600',
  },
  menuCancel: {
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 12,
    backgroundColor: '#292131',
  },
  menuCancelText: {
    color: '#D5B3F5',
    fontSize: 12,
    fontWeight: '700',
  },
});
