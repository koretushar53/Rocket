import { router } from 'expo-router';
import { ArrowDown, ArrowUp, ListMusic, Plus, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AlbumArtwork from '@/components/AlbumArtwork';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { usePlayer } from '@/components/PlayerProvider';

export default function QueueScreen() {
  const insets = useSafeAreaInsets();
  const [confirmClear, setConfirmClear] = useState(false);
  const {
    songs,
    currentSong,
    queue,
    playSong,
    replaceQueue,
    removeFromQueue,
    moveQueueSong,
    clearQueue,
  } = usePlayer();

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
      <View style={styles.page}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close queue">
          <X size={19} color="#F6F3FA" />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>UP NEXT</Text>
          <Text style={styles.title}>Play queue</Text>
        </View>
        <Pressable onPress={() => setConfirmClear(true)} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Clear queue">
          <Trash2 size={17} color="#B98798" />
        </Pressable>
      </View>

      <View style={styles.nowPlaying}>
        <AlbumArtwork song={currentSong} size={48} radius={13} />
        <View style={styles.nowMeta}>
          <Text style={styles.nowLabel}>CURRENT TRACK</Text>
          <Text style={styles.nowTitle} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.nowArtist} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
        <ListMusic size={19} color="#C084FC" />
      </View>

      <View style={styles.queueHeader}>
        <View>
          <Text style={styles.sectionTitle}>Next in line</Text>
          <Text style={styles.countText}>{queue.length} {queue.length === 1 ? 'track' : 'tracks'}</Text>
        </View>
        <Pressable
          style={styles.addAllButton}
          onPress={() => replaceQueue(songs.map((song) => song.id))}
          accessibilityRole="button"
          accessibilityLabel="Add all local songs to queue"
        >
          <Plus size={14} color="#D9B6F7" />
          <Text style={styles.addAllText}>Add all</Text>
        </Pressable>
      </View>

      <FlatList
        data={queue}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => {
          const song = songs.find((track) => track.id === item);
          if (!song) return null;
          const isCurrent = currentSong.id === song.id;
          return (
            <View style={[styles.row, isCurrent && styles.currentRow]}>
              <Pressable style={styles.songButton} onPress={() => playSong(song.id)} accessibilityRole="button">
                <AlbumArtwork song={song} size={48} radius={13} />
                <View style={styles.songMeta}>
                  <Text style={[styles.songTitle, isCurrent && styles.currentText]} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                  {isCurrent ? <Text style={styles.currentLabel}>CURRENT TRACK</Text> : null}
                </View>
              </Pressable>
              <View style={styles.rowActions}>
                <Pressable
                  onPress={() => moveQueueSong(song.id, -1)}
                  disabled={index === 0}
                  style={styles.rowAction}
                  accessibilityRole="button"
                  accessibilityLabel={`Move ${song.title} up`}
                >
                  <ArrowUp size={15} color={index === 0 ? '#494551' : '#9A93A2'} />
                </Pressable>
                <Pressable
                  onPress={() => moveQueueSong(song.id, 1)}
                  disabled={index === queue.length - 1}
                  style={styles.rowAction}
                  accessibilityRole="button"
                  accessibilityLabel={`Move ${song.title} down`}
                >
                  <ArrowDown size={15} color={index === queue.length - 1 ? '#494551' : '#9A93A2'} />
                </Pressable>
                <Pressable
                  onPress={() => removeFromQueue(song.id)}
                  style={styles.rowAction}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${song.title} from queue`}
                >
                  <X size={16} color="#9A93A2" />
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ListMusic size={27} color="#9564B8" />
            <Text style={styles.emptyTitle}>Your queue is clear</Text>
            <Text style={styles.emptyCopy}>Add your local songs to line up what plays next.</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      </View>
      <ConfirmationDialog
        visible={confirmClear}
        title="Clear play queue?"
        message="Your current track will keep playing."
        confirmLabel="Clear queue"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clearQueue();
          setConfirmClear(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 19,
    backgroundColor: '#0B0A10',
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 19,
  },
  closeButton: {
    width: 37,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#1A1720',
  },
  headerCopy: {
    flex: 1,
    alignItems: 'center',
  },
  eyebrow: {
    color: '#A89EB2',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: '#F6F3FA',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },
  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    borderRadius: 17,
    backgroundColor: '#21172C',
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.2)',
    marginBottom: 23,
  },
  nowMeta: {
    flex: 1,
    marginHorizontal: 11,
  },
  nowLabel: {
    color: '#C084FC',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nowTitle: {
    color: '#F7F2FC',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  nowArtist: {
    color: '#A49CAB',
    fontSize: 10,
    marginTop: 3,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },
  sectionTitle: {
    color: '#F3EFF7',
    fontSize: 15,
    fontWeight: '800',
  },
  countText: {
    color: '#8E8896',
    fontSize: 10,
    marginTop: 3,
  },
  addAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
    backgroundColor: '#2A1D38',
  },
  addAllText: {
    color: '#D9B6F7',
    fontSize: 10,
    fontWeight: '700',
  },
  list: {
    paddingBottom: 28,
    flexGrow: 1,
  },
  row: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.055)',
  },
  currentRow: {
    backgroundColor: 'rgba(151,61,206,0.08)',
  },
  songButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songMeta: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  songTitle: {
    color: '#EDE9F2',
    fontSize: 11,
    fontWeight: '700',
  },
  currentText: {
    color: '#D9B6F7',
  },
  songArtist: {
    color: '#8E8896',
    fontSize: 9,
    marginTop: 3,
  },
  currentLabel: {
    color: '#B86BF1',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 3,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowAction: {
    width: 27,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: '#F1ECF5',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 13,
  },
  emptyCopy: {
    color: '#8D8795',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 5,
  },
});
