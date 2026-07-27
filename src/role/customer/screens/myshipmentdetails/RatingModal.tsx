import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { X, Star, User } from 'lucide-react-native';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
} from '../../../../constants';
import { AppText } from '../../../../components';

interface Props {
  visible: boolean;
  onClose: () => void;
  shipperName: string;
  shipmentTitle: string;
}

const RatingModal = ({
  visible,
  onClose,
  shipperName,
  shipmentTitle,
}: Props) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
        >
          <Pressable style={styles.modalView}>
            {/* Header */}
            <View style={styles.header}>
              <AppText style={styles.modalTitle}>Rate your shipment</AppText>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <AppText style={styles.description}>
              How was your delivery for the shipment{'\n'}
              <AppText style={{ fontFamily: FONTS.bold }}>
                {shipmentTitle}?
              </AppText>
            </AppText>

            <View style={styles.shipperRow}>
              <View style={styles.avatar}>
                <User size={18} color={COLORS.goldPrimary} />
              </View>
              <AppText style={styles.shipperName}>{shipperName}</AppText>
            </View>

            {/* Stars */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Star
                    size={32}
                    color={COLORS.goldPrimary}
                    fill={s <= rating ? COLORS.goldPrimary : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Input */}
            <AppText style={styles.inputLabel}>
              Write a review about your shipper
            </AppText>
            <TextInput
              style={styles.textInput}
              placeholder="Amazing shipper! Prompt communication..."
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={4}
              value={review}
              onChangeText={setReview}
            />

            <TouchableOpacity style={styles.confirmBtn} onPress={onClose}>
              <AppText style={styles.confirmBtnText}>Confirm</AppText>
            </TouchableOpacity>

            <AppText style={styles.footerText}>
              If you need to report any issues or incidents{'\n'}
              related to this shipment{' '}
              <AppText style={styles.linkText}>contact us here.</AppText>
            </AppText>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  centeredView: { flex: 1, justifyContent: 'center' },
  modalView: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  shipperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipperName: { fontSize: 14, fontFamily: FONTS.medium },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    height: 100,
    textAlignVertical: 'top',
    fontFamily: FONTS.regular,
    marginBottom: SPACING.xl,
  },
  confirmBtn: {
    backgroundColor: COLORS.goldPrimary,
    padding: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  confirmBtnText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 15 },
  footerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: { color: COLORS.info, textDecorationLine: 'underline' },
  closeBtn: { padding: 4 },
});

export default RatingModal;
