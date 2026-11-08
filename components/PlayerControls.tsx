import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react-native';

type PlayerControlsProps = {
  isPlaying: boolean;
  shuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
};

export default function PlayerControls({
  isPlaying,
  shuffle,
  repeatMode,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
}: PlayerControlsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Pressable onPress={onShuffle} style={[styles.control, shuffle && styles.controlActive]}>
          <Shuffle size={18} color={shuffle ? '#090710' : '#F3EEFF'} />
        </Pressable>

        <Pressable onPress={onPrevious} style={styles.control}>
          <SkipBack size={22} color="#F3EEFF" />
        </Pressable>

        <Pressable onPress={onPlayPause} style={styles.primaryButton}>
          {isPlaying ? <Pause size={28} color="#090710" fill="#090710" /> : <Play size={28} color="#090710" fill="#090710" />}
        </Pressable>

        <Pressable onPress={onNext} style={styles.control}>
          <SkipForward size={22} color="#F3EEFF" />
        </Pressable>

        <Pressable onPress={onRepeat} style={[styles.control, repeatMode !== 'off' && styles.controlActive]}>
          <Repeat size={18} color={repeatMode !== 'off' ? '#090710' : '#F3EEFF'} />
          {repeatMode === 'one' ? <Text style={styles.repeatText}>1</Text> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  control: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  controlActive: {
    backgroundColor: '#A855F7',
  },
  primaryButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#A855F7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A855F7',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 8,
  },
  repeatText: {
    position: 'absolute',
    right: 7,
    bottom: 5,
    fontSize: 9,
    fontWeight: '800',
    color: '#090710',
  },
});
