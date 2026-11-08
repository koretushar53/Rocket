import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type ConfirmationDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel confirmation" />
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelButton} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.confirmButton} accessibilityRole="button">
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#1A1821',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    color: '#F6F3FA',
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    color: '#A8A2B0',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 20,
  },
  cancelButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#292631',
  },
  cancelText: {
    color: '#C8C2CE',
    fontSize: 12,
    fontWeight: '700',
  },
  confirmButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#6E2B8F',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
