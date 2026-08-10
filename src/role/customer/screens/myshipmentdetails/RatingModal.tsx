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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Star, User } from 'lucide-react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
  SIZES,
} from '../../../../constants';
import { AppText, Input } from '../../../../components';
import customerService from '../../../../api/services/customerService';

interface Props {
  visible: boolean;
  onClose: () => void;
  shipperName: string;
  shipmentTitle: string;
  shipperId?: string;
  shipmentId?: string;
  onSuccess?: () => void;
}

const RatingModal = ({
  visible,
  onClose,
  shipperName,
  shipmentTitle,
  shipperId,
  shipmentId,
  onSuccess,
}: Props) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!rating || rating === 0) {
      Alert.alert('Rating Required', 'Please select at least 1 star rating.');
      return;
    }
    if (!shipperId || !shipmentId) {
      Alert.alert('Error', 'Missing shipper or shipment information.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await customerService.createReview({
        shipperId,
        shipmentId,
        rating,
        reviewText: review.trim(),
      });

      if (res.success || (res as any).data) {
        Alert.alert('Success', res.message || 'Review added successfully');
        setRating(0);
        setReview('');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        // Alert.alert('Error', res.message || 'Failed to submit review.');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || error?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

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
                <User size={18} color={COLORS.primary} />
              </View>
              <AppText style={styles.shipperName}>{shipperName}</AppText>
            </View>

            {/* Stars */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Star
                    size={32}
                    color={COLORS.primary}
                    fill={s <= rating ? COLORS.primary : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Input */}
            <Input
              label="Write a review about your shipper"
              placeholder="Amazing shipper! Prompt communication..."
              multiline
              value={review}
              onChangeText={setReview}
              containerStyle={{ marginBottom: SPACING.xl }}
            />

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <AppText style={styles.confirmBtnText}>Submit Review</AppText>
              )}
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
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: SPACING.xl,
    marginBottom: SPACING.md,
  },
  shipperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: SIZES.avatarSm,
    height: SIZES.avatarSm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipperName: { fontSize: FONT_SIZE.md, fontFamily: FONTS.medium },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
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
    backgroundColor: COLORS.primary,
    padding: SPACING.md2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  confirmBtnText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: { color: COLORS.info, textDecorationLine: 'underline' },
  closeBtn: { padding: 4 },
});

export default RatingModal;
