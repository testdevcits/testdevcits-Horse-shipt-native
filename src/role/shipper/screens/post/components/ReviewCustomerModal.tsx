import React, { useState, useEffect, memo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { COLORS, FONTS } from '../../../../../constants';
import { AppText, Button } from '../../../../../components';
import shipperService from '../../../../../api/services/shipperService';
import AppIcon from '../../../../../components/app_icon/AppIcon';

import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from '../../../../../utils/toast';
import styles from './styles.ReviewCustomer';

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
    typeof rawCustomerId === 'object'
      ? rawCustomerId?._id || ''
      : rawCustomerId;

  const customerName =
    item?.customerName ||
    item?.customerId?.name ||
    item?.customer?.name ||
    shipment?.customerName ||
    shipment?.customerId?.name ||
    shipment?.customer?.name ||
    'Customer';

  const shipmentCode =
    item?.shipmentCode ||
    shipment?.shipmentCode ||
    (shipmentId ? shipmentId.slice(-6) : '');

  const handleSubmitReview = async () => {
    if (!rating || rating === 0) {
      showInfoToast('Rating Required', 'Please select at least 1 star rating.');
      return;
    }

    if (!customerId || !shipmentId) {
      showErrorToast('Error', 'Missing customer or shipment information.');
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

      if (res?.success || (res as any).data) {
        showSuccessToast(
          'Success',
          res.message || 'Customer review submitted successfully',
        );
        setRating(5);
        setReviewText('');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showErrorToast(
          'Error',
          res.message || 'Failed to submit customer review.',
        );
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to submit customer review.';
      showErrorToast('Error', errMsg);
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
        >
          <Pressable
            style={styles.modalView}
            onPress={e => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <AppText style={styles.modalTitle}>Review Customer</AppText>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <AppIcon name="X" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Description / Info */}
            <AppText style={styles.description}>
              Share your experience with the customer for shipment{'\n'}
              <AppText
                style={{ fontFamily: FONTS.bold, color: COLORS.primary }}
              >
                #{shipmentCode}
              </AppText>
            </AppText>

            {/* Customer Badge */}
            <View style={styles.customerRow}>
              <View style={styles.avatar}>
                <AppIcon name="User" size={18} color={COLORS.amberPrimary} />
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
                    <AppIcon
                      name="Star"
                      size={32}
                      color={s <= rating ? COLORS.warning : COLORS.grey300}
                      fill={s <= rating ? COLORS.warning : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <AppText style={styles.ratingLabel}>
                {getRatingLabel(rating)}
              </AppText>
            </View>

            {/* Review Input */}
            <View style={styles.inputContainer}>
              <AppText style={styles.inputLabel}>Review Feedback</AppText>
              <TextInput
                allowFontScaling={false}
                style={styles.textInput}
                placeholder="Write your review about this customer..."
                placeholderTextColor={COLORS.textLight}
                multiline
                numberOfLines={4}
                value={reviewText}
                onChangeText={setReviewText}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Action Button */}

            <Button
              title="Submit Review"
              onPress={handleSubmitReview}
              disabled={submitting}
              isLoading={submitting}
            />
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default memo(ReviewCustomerModal);
