import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { CardField } from '@stripe/stripe-react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS, FONT_SIZE, ICON_SIZE } from '../../../../../../constants';
import styles from './styles.QuoteDetailModal';

interface QuoteAcceptanceFormProps {
  sigRef: React.RefObject<any>;
  setScrollEnabled: (enabled: boolean) => void;
  setCardDetails: (details: any) => void;
  signature: string | null;
  setSignature: (sig: string | null) => void;
  isAcceptedTerms: boolean;
  setIsAcceptedTerms: (accepted: boolean) => void;
}

const QuoteAcceptanceForm: React.FC<QuoteAcceptanceFormProps> = ({
  sigRef,
  setScrollEnabled,
  setCardDetails,
  signature,
  setSignature,
  isAcceptedTerms,
  setIsAcceptedTerms,
}) => {
  return (
    <View style={[styles.cardContainer, styles.highlightCard]}>
      <View style={styles.highlightHeader}>
        <AppIcon
          name={'ShieldCheck'}
          size={ICON_SIZE.sm}
          color={COLORS.primary}
        />
        <AppText style={styles.highlightTitle}>Acceptance & Payment</AppText>
      </View>
      <AppText style={styles.highlightSub}>
        Enter your card details and sign below to accept this quote.
      </AppText>

      {/* 1. STRIPE CARD FIELD */}
      <View style={styles.inputLabelRow}>
        <AppIcon
          name={'CreditCard'}
          size={ICON_SIZE.sm}
          color={COLORS.grey700}
        />
        <AppText style={styles.inputLabel}>Card Details</AppText>
      </View>
      <View style={styles.stripeCardContainer}>
        <CardField
          postalCodeEnabled={true}
          style={styles.stripeCardField}
          cardStyle={{
            backgroundColor: COLORS.white,
            textColor: COLORS.textPrimary,
            fontSize: FONT_SIZE.md,
          }}
          onCardChange={setCardDetails}
        />
      </View>

      {/* 2. SIGNATURE CANVAS */}
      <View style={styles.signatureHeader}>
        <AppText style={styles.inputLabel}>Your Signature *</AppText>
        {signature ? (
          <View style={styles.capturedBadge}>
            <AppIcon name={'Check'} size={ICON_SIZE.xs} color={COLORS.white} />
            <AppText style={styles.capturedText}>Captured</AppText>
          </View>
        ) : (
          <AppText style={styles.signatureSub}>Draw inside box</AppText>
        )}
      </View>
      <View style={styles.signatureWrap}>
        <SignatureScreen
          ref={sigRef}
          onBegin={() => setScrollEnabled(false)}
          onEnd={() => {
            setScrollEnabled(true);
            sigRef.current?.readSignature();
          }}
          onOK={setSignature}
          webStyle={`.m-signature-pad--footer {display: none;}`}
        />
      </View>
      {signature && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => {
            sigRef.current?.clearSignature();
            setSignature(null);
          }}
        >
          <AppIcon name={'Trash2'} size={ICON_SIZE.xs} color={COLORS.error} />
          <AppText style={styles.clearText}>Clear Signature</AppText>
        </TouchableOpacity>
      )}

      {/* 3. TERMS & CONDITIONS CHECKBOX */}
      <TouchableOpacity
        style={styles.termsRow}
        activeOpacity={0.8}
        onPress={() => setIsAcceptedTerms(!isAcceptedTerms)}
      >
        <View
          style={[styles.checkbox, isAcceptedTerms && styles.checkboxActive]}
        >
          {isAcceptedTerms && (
            <AppIcon name={'Check'} size={ICON_SIZE.xs} color={COLORS.white} />
          )}
        </View>
        <AppText style={styles.termsLabel}>
          I have reviewed and agree to the terms, conditions, and cancellation
          policy.
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(QuoteAcceptanceForm);
