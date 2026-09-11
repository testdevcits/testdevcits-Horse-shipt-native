import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
  SIZES,
} from '../../../../../../constants';
import { AppText, Button, Input } from '../../../../../../components';
import customerService from '../../../../../../api/services/customerService';
import AppIcon from '../../../../../../components/AppIcon';
import styles from './styles.RatingModal';
import Toast from 'react-native-toast-message';

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
      // Alert.alert('Rating Required', 'Please select at least 1 star rating.');
      Toast.show({
        type: 'info',
        text1: 'Rating Required',
        text2: 'Please select at least 1 star rating.',
      });
      return;
    }
    if (!shipperId || !shipmentId) {
      // Alert.alert('Error', 'Missing shipper or shipment information.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Missing shipper or shipment information.',
      });
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

      if (res?.success || (res as any).data) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message || 'Review added successfully',
        });
        setRating(0);
        setReview('');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        // Alert.alert('Error', res.message || 'Failed to submit review.');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Failed to submit review.',
      );
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
                <AppIcon name={'X'} size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <AppText style={styles.description}>
              How was your delivery for the shipment{'\n'}
              <AppText style={{ fontFamily: FONTS.bold }}>
                {shipmentTitle}?
              </AppText>
            </AppText>
            {shipperName !== null &&
              shipperName !== '' &&
              shipmentTitle !== undefined && (
                <View style={styles.shipperRow}>
                  <View style={styles.avatar}>
                    <AppIcon name={'User'} size={18} color={COLORS.primary} />
                  </View>
                  <AppText style={styles.shipperName}>{shipperName}</AppText>
                </View>
              )}

            {/* Stars */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <AppIcon
                    name={'Star'}
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

            <Button
              title="Submit Review"
              onPress={handleSubmitReview}
              disabled={submitting}
              isLoading={submitting}
            />

            {/* <AppText style={styles.footerText}>
              If you need to report any issues or incidents{'\n'}
              related to this shipment{' '}
              <AppText style={styles.linkText}>contact us here.</AppText>
            </AppText> */}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default RatingModal;
