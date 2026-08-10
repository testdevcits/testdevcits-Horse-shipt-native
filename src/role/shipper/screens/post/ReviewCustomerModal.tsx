import React, { useState, useEffect, memo } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { X, Star, User } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../../constants';
import { AppText, Button } from '../../../../components';
import shipperService from '../../../../api/services/shipperService';

interface ReviewCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  onSuccess?: () => void;
}

export const ReviewCustomerModal: React.FC<ReviewCustomerModalProps> = ({
  visible,
  onClose,
  item,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setRating(5);
      setReviewText('');
    }
  }, [visible]);

  const shipment = item?.shipment || item;
  const shipmentId =
    shipment?._id || item?._id || item?.shipmentId || item?.id || '';

  const rawCustomerId =
    item?.customerId ||
    item?.customer ||
    item?.userId ||
    shipment?.customerId ||
    shipment?.customer ||
    shipment?.userId ||
    '';

  const customerId =
    typeof rawCustomerId === 'object' ? rawCustomerId?._id || '' : rawCustomerId;

  const customerName =
    item?.customerName ||
    item?.customerId?.name ||
    item?.customer?.name ||
    shipment?.customerName ||
    shipment?.customerId?.name ||
    shipment?.customer?.name ||
    'Customer';

  const shipmentCode =
    item?.shipmentCode || shipment?.shipmentCode || (shipmentId ? shipmentId.slice(-6) : '');

  const handleSubmitReview = async () => {
    if (!rating || rating === 0) {
      Alert.alert('Rating Required', 'Please select at least 1 star rating.');
      return;
    }

    if (!customerId || !shipmentId) {
      Alert.alert('Error', 'Missing customer or shipment information.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await shipperService.submitCustomerReview({
        customerId,
        shipmentId,
        rating,
        reviewText: reviewText.trim(),
      });

      if (res.success || (res as any).data) {
        Alert.alert('Success', res.message || 'Customer review submitted successfully');
        setRating(5);
        setReviewText('');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        Alert.alert('Error', res.message || 'Failed to submit customer review.');
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to submit customer review.';
      Alert.alert('Error', errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return 'Excellent';
      case 4:
        return 'Good';
      case 3:
        return 'Average';
      case 2:
        return 'Poor';
      case 1:
        return 'Very Poor';
      default:
        return 'Select Rating';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
        >
          <Pressable style={styles.modalView} onPress={e => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.header}>
              <AppText style={styles.modalTitle}>Review Customer</AppText>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Description / Info */}
            <AppText style={styles.description}>
              Share your experience with the customer for shipment{'\n'}
              <AppText style={{ fontFamily: FONTS.bold, color: COLORS.primary }}>
                #{shipmentCode}
              </AppText>
            </AppText>

            {/* Customer Badge */}
            <View style={styles.customerRow}>
              <View style={styles.avatar}>
                <User size={18} color="#D97706" />
              </View>
              <AppText style={styles.customerName}>{customerName}</AppText>
            </View>

            {/* Star Rating Row */}
            <View style={styles.ratingSection}>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setRating(s)}
                    activeOpacity={0.7}
                    style={{ padding: 4 }}
                  >
                    <Star
                      size={32}
                      color={s <= rating ? '#F59E0B' : '#CBD5E1'}
                      fill={s <= rating ? '#F59E0B' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <AppText style={styles.ratingLabel}>{getRatingLabel(rating)}</AppText>
            </View>

            {/* Review Input */}
            <View style={styles.inputContainer}>
              <AppText style={styles.inputLabel}>Review Feedback</AppText>
              <TextInput
                allowFontScaling={false}
                style={styles.textInput}
                placeholder="Write your review about this customer..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={reviewText}
                onChangeText={setReviewText}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Action Button */}

            <Button title='Submit Review' onPress={handleSubmitReview} disabled={submitting} isLoading={submitting} />
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  centeredView: {
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  modalTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    gap: 8,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerName: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: '#92400E',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ratingLabel: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    minHeight: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },

});

export default memo(ReviewCustomerModal);
