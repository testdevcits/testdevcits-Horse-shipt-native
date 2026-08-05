import React, { memo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { X, ShieldCheck, AlertCircle, User } from 'lucide-react-native';
import { CardField } from '@stripe/stripe-react-native';
import { AppText, Input } from '../../../../components';
import { COLORS, FONT_SIZE, FONTS, SPACING, RADIUS } from '../../../../constants';
import styles from './styles.earnings';

interface StripePaymentMethodCardModalProps {
  isCardModalVisible: boolean;
  setIsCardModalVisible: (visible: boolean) => void;
  cardStatus: { hasCard: boolean };
  submittingCard: boolean;
  formError: string;
  cardholderName: string;
  setCardholderName: (name: string) => void;
  cardDetails: any;
  setCardDetails: (details: any) => void;
  handleSavePaymentMethod: () => void;
}

const StripePaymentMethodCardModal: React.FC<StripePaymentMethodCardModalProps> = ({
  isCardModalVisible,
  setIsCardModalVisible,
  cardStatus,
  submittingCard,
  formError,
  cardholderName,
  setCardholderName,
  cardDetails,
  setCardDetails,
  handleSavePaymentMethod,
}) => {
  return (
    <Modal
      visible={isCardModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsCardModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeaderRow}>
            <AppText style={styles.modalTitle}>
              {cardStatus.hasCard ? 'Update Payment Method' : 'Add Payment Method'}
            </AppText>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsCardModalVisible(false)}
              disabled={submittingCard}
            >
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <AppText style={styles.modalSub}>
            Enter your credit or debit card details securely below.
          </AppText>

          {/* Error Banner */}
          {!!formError && (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color="#DC2626" />
              <AppText style={styles.errorBannerText}>{formError}</AppText>
            </View>
          )}

          {/* Cardholder Name */}
          <Input
            label="Cardholder Name (Optional)"
            placeholder="e.g. John Doe"
            value={cardholderName}
            onChangeText={setCardholderName}
            editable={!submittingCard}
            leftIcon={<User size={16} color={COLORS.textSecondary} />}
          />

          {/* Stripe Card Field Component */}
          <View style={styles.inputGroup}>
            <AppText style={styles.inputLabel}>Card Details *</AppText>
            <View style={styles.stripeCardContainer}>
              <CardField
                postalCodeEnabled={true}
                style={styles.stripeCardField}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: COLORS.textPrimary,
                  fontSize: FONT_SIZE.md,
                  placeholderColor: COLORS.textLight,
                }}
                onCardChange={details => setCardDetails(details)}
              />
            </View>
          </View>

          {/* Security Row */}
          <View style={styles.securityRow}>
            <ShieldCheck size={14} color={COLORS.greenSuccess} />
            <AppText style={styles.securityText}>
              Secured & encrypted via Stripe 256-bit SSL
            </AppText>
          </View>

          {/* Modal Actions */}
          <View style={styles.modalActionsRow}>
            <TouchableOpacity
              style={styles.cancelModalBtn}
              onPress={() => setIsCardModalVisible(false)}
              disabled={submittingCard}
            >
              <AppText style={styles.cancelModalBtnText}>Cancel</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitModalBtn,
                (!cardDetails?.complete || submittingCard) && { opacity: 0.7 },
              ]}
              onPress={handleSavePaymentMethod}
              disabled={submittingCard}
              activeOpacity={0.85}
            >
              {submittingCard ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <AppText style={styles.submitModalBtnText}>Save Card</AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(StripePaymentMethodCardModal);