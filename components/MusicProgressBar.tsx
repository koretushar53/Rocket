import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';

import { formatDuration } from '@/constants/music';

type MusicProgressBarProps = {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
};

export default function MusicProgressBar({ currentTime, duration, onSeek }: MusicProgressBarProps) {
  const [width, setWidth] = useState(0);
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePress = (event: GestureResponderEvent) => {
    const nativeEvent = event.nativeEvent;
    const locationX = Number.isFinite(nativeEvent.locationX)
      ? nativeEvent.locationX
      : Platform.OS === 'web' && 'offsetX' in nativeEvent && typeof nativeEvent.offsetX === 'number'
        ? nativeEvent.offsetX
        : Number.NaN;
    if (!Number.isFinite(locationX) || !Number.isFinite(duration) || duration <= 0 || width <= 0) return;
    const next = Math.max(0, Math.min(duration, (locationX / width) * duration));
    onSeek(next);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.trackTouchArea}
        onPress={handlePress}
        onTouchMove={Platform.OS === 'web' ? undefined : handlePress}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        accessibilityRole="adjustable"
        accessibilityLabel="Track position"
        accessibilityValue={{ min: 0, max: duration, now: currentTime }}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%` }]} />
          <View style={[styles.thumb, { left: `${Math.min(percent, 100)}%` }]} />
        </View>
      </Pressable>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{formatDuration(currentTime)}</Text>
        <Text style={styles.label}>{formatDuration(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  trackTouchArea: {
    height: 22,
    justifyContent: 'center',
  },
  track: {
    position: 'relative',
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#A855F7',
    borderRadius: 999,
  },
  thumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5F3FF',
    transform: [{ translateX: -6 }],
    shadowColor: '#A855F7',
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  labelRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#D3C5E5',
    fontSize: 11,
    fontWeight: '600',
  },
});
