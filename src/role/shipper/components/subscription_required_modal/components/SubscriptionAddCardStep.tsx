import React, { memo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS, FONT_SIZE } from '../../../../../constants';
import styles from '../styles.subscriptionRequiredModal';

interface SubscriptionAddCardStepProps {
  cardError: string;
  isSavingCard: boolean;
  onCardChange: (details: any) => void;
  onSaveCardAndContinue: () => void;
  onBack: () => void;
}

const SubscriptionAddCardStep: React.FC<SubscriptionAddCardStepProps> = ({
  cardError,
  isSavingCard,
  onCardChange,
  onSaveCardAndContinue,
  onBack,
}) => {
  return (
    <View style={{ width: '100%' }}>
      {/* Header Title Row */}
      <View style={styles.addCardHeaderRow}>
        <AppIcon name={'CreditCard'} size={20} color={COLORS.textPrimary} />
        <AppText style={styles.addCardHeaderTitle}>
          Add Payment Method
        </AppText>
      </View>
      <AppText style={styles.addCardSubTitle}>
        You won't be charged until your trial ends
      </AppText>

      {/* Card Input Error Banner */}
      {!!cardError && (
        <View style={styles.errorBanner}>
          <AppIcon name={'AlertCircle'} size={15} color={COLORS.redPrimary} />
          <AppText style={styles.errorBannerText}>{cardError}</AppText>
        </View>
      )}

      {/* Embedded Stripe Card Field */}
      <View style={styles.stripeCardContainer}>
        <CardField
          postalCodeEnabled={true}
          style={styles.stripeCardField}
          cardStyle={{
            backgroundColor: COLORS.white,
            textColor: COLORS.textPrimary,
            fontSize: FONT_SIZE.md,
            placeholderColor: COLORS.textLight,
          }}
          onCardChange={onCardChange}
        />
      </View>

      {/* Security Guarantee Box */}
      <View style={styles.securityNoteBox}>
        <AppText style={styles.securityNoteText}>
          We never store full card numbers. Secured by Stripe.
        </AppText>
      </View>

      {/* Save Card & Continue Button */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onSaveCardAndContinue}
        disabled={isSavingCard}
        activeOpacity={0.88}
      >
        {isSavingCard ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <View style={styles.actionBtnContent}>
            <AppIcon name={'Check'} size={18} color={COLORS.white} />
            <AppText style={styles.actionBtnText}>
              Save Card & Continue
            </AppText>
          </View>
        )}
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        disabled={isSavingCard}
      >
        <AppText style={styles.backBtnText}>Back</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(SubscriptionAddCardStep);
