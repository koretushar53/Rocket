import { LinearGradient } from 'expo-linear-gradient';
import { Check, ListMusic, Minus, Play, Plus, Trash2, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AlbumArtwork from '@/components/AlbumArtwork';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { usePlayer } from '@/components/PlayerProvider';
import type { Song } from '@/constants/music';
import type { Playlist } from '@/storage/playlists';

export default function PlaylistsScreen() {
  const insets = useSafeAreaInsets();
  const {
    songs,
    playlists,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    playQueue,
  } = usePlayer();
  const [draft, setDraft] = useState('');
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [playlistPendingDelete, setPlaylistPendingDelete] = useState<Playlist | null>(null);
  const activePlaylist = playlists.find((playlist) => playlist.id === activePlaylistId) ?? null;

  const create = () => {
    if (!draft.trim()) return;
    createPlaylist(draft);
    setDraft('');
    Keyboard.dismiss();
  };

  const playlistSongs = useMemo(() => (playlist: Playlist) =>
    playlist.trackIds.map((id) => songs.find((song) => song.id === id)).filter((song): song is Song => Boolean(song)),
  [songs]);

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
      <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>MAKE IT YOURS</Text>
          <Text style={styles.title}>Playlists</Text>
        </View>
        <View style={styles.countBadge}>
          <ListMusic size={14} color="#C084FC" />
          <Text style={styles.countText}>{playlists.length}</Text>
        </View>
      </View>

      <LinearGradient colors={['#21162D', '#15121B']} style={styles.createPanel}>
        <View style={styles.createCopy}>
          <Text style={styles.createTitle}>A soundtrack of your own</Text>
          <Text style={styles.createSubtitle}>Gather your favorite local tracks.</Text>
        </View>
        <View style={styles.createRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Name your playlist"
            placeholderTextColor="#777280"
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={create}
            accessibilityLabel="New playlist name"
          />
          <Pressable
            style={[styles.createButton, !draft.trim() && styles.disabledButton]}
            onPress={create}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Create playlist"
          >
            <Plus size={19} color="#FFFFFF" />
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Your collections</Text>
        <Text style={styles.listHint}>{playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {playlists.map((playlist) => {
          const tracks = playlistSongs(playlist);
          const firstTrack = tracks[0];
          return (
            <View key={playlist.id} style={styles.playlistPanel}>
              <Pressable
                style={styles.playlistTop}
                onPress={() => firstTrack ? playQueue(tracks.map((song) => song.id)) : setActivePlaylistId(playlist.id)}
                accessibilityRole="button"
                accessibilityLabel={firstTrack ? `Play ${playlist.name}` : `Add tracks to ${playlist.name}`}
              >
                {firstTrack ? (
                  <AlbumArtwork song={firstTrack} size={72} radius={18} />
                ) : (
                  <View style={styles.emptyArtwork}>
                    <ListMusic size={23} color="#C084FC" />
                  </View>
                )}
                <View style={styles.playlistMeta}>
                  <Text style={styles.playlistName} numberOfLines={1}>{playlist.name}</Text>
                  <Text style={styles.playlistInfo}>{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}</Text>
                  {firstTrack ? <Text style={styles.playlistArtist} numberOfLines={1}>{firstTrack.artist}</Text> : null}
                </View>
                {firstTrack ? (
                  <View style={styles.playIcon}><Play size={15} fill="#FFFFFF" color="#FFFFFF" /></View>
                ) : null}
              </Pressable>

              {tracks.length > 0 ? (
                <View style={styles.trackPreview}>
                  {tracks.slice(0, 3).map((song) => (
                    <View key={song.id} style={styles.trackPreviewRow}>
                      <Text style={styles.trackPreviewText} numberOfLines={1}>{song.title}</Text>
                      <Pressable
                        onPress={() => removeSongFromPlaylist(playlist.id, song.id)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${song.title} from ${playlist.name}`}
                      >
                        <Minus size={15} color="#898391" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}

              <View style={styles.actions}>
                <Pressable style={styles.actionButton} onPress={() => setActivePlaylistId(playlist.id)}>
                  <Plus size={15} color="#C084FC" />
                  <Text style={styles.actionText}>Add songs</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => setPlaylistPendingDelete(playlist)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${playlist.name}`}
                >
                  <Trash2 size={15} color="#B27B8B" />
                </Pressable>
              </View>
            </View>
          );
        })}
        {playlists.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><ListMusic size={22} color="#B76BF4" /></View>
            <Text style={styles.emptyTitle}>Your playlists start here</Text>
            <Text style={styles.emptyText}>Create a collection, then add tracks from your local library.</Text>
          </View>
        ) : null}
      </ScrollView>
      </View>

      <Modal
        visible={Boolean(activePlaylist)}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActivePlaylistId(null)}
      >
        <View style={[styles.pickerScreen, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <View style={styles.pickerHeader}>
            <View>
              <Text style={styles.eyebrow}>CURATE YOUR COLLECTION</Text>
              <Text style={styles.pickerTitle} numberOfLines={1}>{activePlaylist?.name ?? 'Add songs'}</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={() => setActivePlaylistId(null)} accessibilityRole="button" accessibilityLabel="Close track picker">
              <X size={19} color="#F6F3FA" />
            </Pressable>
          </View>
          <Text style={styles.pickerHint}>Tap the check to remove a track, or add it to this playlist.</Text>
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isAdded = activePlaylist?.trackIds.includes(item.id) ?? false;
              return (
                <View style={styles.pickerRow}>
                  <AlbumArtwork song={item} size={48} radius={13} />
                  <View style={styles.pickerMeta}>
                    <Text style={styles.pickerSong} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.pickerArtist} numberOfLines={1}>{item.artist}</Text>
                  </View>
                  <Pressable
                    style={[styles.addTrackButton, isAdded && styles.addedTrackButton]}
                    onPress={() => {
                      if (!activePlaylist) return;
                      if (isAdded) removeSongFromPlaylist(activePlaylist.id, item.id);
                      else addSongToPlaylist(activePlaylist.id, item.id);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={isAdded ? `Remove ${item.title}` : `Add ${item.title}`}
                  >
                    {isAdded ? <Check size={17} color="#D8B5F8" /> : <Plus size={17} color="#D8B5F8" />}
                  </Pressable>
                </View>
              );
            }}
            contentContainerStyle={styles.pickerList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
      <ConfirmationDialog
        visible={Boolean(playlistPendingDelete)}
        title="Delete playlist?"
        message={playlistPendingDelete ? `“${playlistPendingDelete.name}” will be removed from your library.` : ''}
        confirmLabel="Delete"
        onCancel={() => setPlaylistPendingDelete(null)}
        onConfirm={() => {
          if (!playlistPendingDelete) return;
          deletePlaylist(playlistPendingDelete.id);
          setPlaylistPendingDelete(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 19,
    backgroundColor: '#08080D',
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
    marginBottom: 19,
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
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: '#21172C',
    borderRadius: 12,
    marginBottom: 3,
  },
  countText: {
    color: '#E1C5FA',
    fontSize: 11,
    fontWeight: '800',
  },
  createPanel: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 23,
  },
  createCopy: {
    marginBottom: 13,
  },
  createTitle: {
    color: '#F4EFF9',
    fontSize: 14,
    fontWeight: '800',
  },
  createSubtitle: {
    color: '#9A92A3',
    fontSize: 10,
    marginTop: 4,
  },
  createRow: {
    flexDirection: 'row',
    gap: 9,
  },
  input: {
    flex: 1,
    height: 45,
    color: '#F6F3FA',
    fontSize: 12,
    paddingHorizontal: 13,
    backgroundColor: '#0F0E14',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 13,
  },
  createButton: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#9333EA',
  },
  disabledButton: {
    backgroundColor: '#49335B',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: {
    color: '#F2EEF7',
    fontSize: 16,
    fontWeight: '800',
  },
  listHint: {
    color: '#898391',
    fontSize: 10,
  },
  list: {
    paddingBottom: 25,
  },
  playlistPanel: {
    padding: 12,
    marginBottom: 11,
    borderRadius: 20,
    backgroundColor: '#121118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  playlistTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyArtwork: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#23182E',
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.18)',
  },
  playlistMeta: {
    flex: 1,
    marginHorizontal: 12,
  },
  playlistName: {
    color: '#F3F0F7',
    fontSize: 14,
    fontWeight: '800',
  },
  playlistInfo: {
    color: '#C084FC',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  playlistArtist: {
    color: '#898391',
    fontSize: 10,
    marginTop: 4,
  },
  playIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#9333EA',
  },
  trackPreview: {
    paddingLeft: 84,
    paddingTop: 5,
  },
  trackPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
    gap: 12,
  },
  trackPreviewText: {
    flex: 1,
    color: '#A8A3B0',
    fontSize: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingRight: 10,
  },
  actionText: {
    color: '#D5B3F5',
    fontSize: 10,
    fontWeight: '700',
  },
  deleteButton: {
    width: 32,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingTop: 55,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#24182F',
  },
  emptyTitle: {
    color: '#F0ECF5',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 13,
  },
  emptyText: {
    color: '#8F8998',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 5,
  },
  pickerScreen: {
    flex: 1,
    paddingHorizontal: 19,
    backgroundColor: '#08080D',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pickerTitle: {
    maxWidth: 270,
    color: '#F6F3FA',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#1C1A22',
  },
  pickerHint: {
    color: '#938D9B',
    fontSize: 11,
    marginBottom: 13,
  },
  pickerList: {
    paddingBottom: 25,
  },
  pickerRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.055)',
  },
  pickerMeta: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 11,
  },
  pickerSong: {
    color: '#F0ECF4',
    fontSize: 12,
    fontWeight: '700',
  },
  pickerArtist: {
    color: '#8F8998',
    fontSize: 10,
    marginTop: 3,
  },
  addTrackButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#2A1D37',
  },
  addedTrackButton: {
    backgroundColor: '#413050',
  },
});
