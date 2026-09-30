import React, { useEffect, useState, useRef, memo } from 'react';
import { Modal, View, TouchableOpacity, ScrollView } from 'react-native';

import { formatDate } from '../../../../../../utils/helpers';
import { COLORS, FONTS, SPACING, ICON_SIZE } from '../../../../../../constants';
import { AppText } from '../../../../../../components';
import { useNavigation } from '@react-navigation/native';
import customerService from '../../../../../../api/services/customerService';
import { useStripe } from '@stripe/stripe-react-native';

import AppIcon, {
  IconName,
} from '../../../../../../components/app_icon/AppIcon';
import styles from './styles.QuoteDetailModal';
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../utils/toast';
import CancelModal from './CancelModal';
import QuoteActionButtons from './QuoteActionButtons';
import QuoteContractsSection from './QuoteContractsSection';
import QuoteAcceptanceForm from './QuoteAcceptanceForm';

const SummaryBox = ({
  icon: Icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: any;
}) => (
  <View style={styles.summaryItem}>
    <View style={styles.summaryItemHeader}>
      <AppIcon name={Icon} size={ICON_SIZE.xs} color={COLORS.primary} />
      <AppText style={styles.summaryLabel}>{label}</AppText>
    </View>
    <AppText style={styles.summaryValue} numberOfLines={1}>
      {value || 'N/A'}
    </AppText>
  </View>
);

const QuoteDetailModal = ({
  visible,
  quote,
  onClose,
  onRefresh,
  isCompleted,
}: any) => {
  const navigation = useNavigation<any>();
  const { confirmPayment } = useStripe();

  // States
  const sigRef = useRef<any>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [isAcceptedTerms, setIsAcceptedTerms] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');

  // Reset states when modal opens
  useEffect(() => {
    if (visible) {
      setIsAcceptedTerms(false);
      setSignature(null);
      setCancelReason('');
      setCancelReasonError('');
      setCardDetails(null);
    }
  }, [visible]);

  if (!quote) return null;

  // Derived Conditions
  const isPending = quote?.status === 'pending';
  const isAccepted = quote?.status === 'accepted';
  const isCancelled = quote?.isCancelled || quote?.status === 'cancelled';
  const isRejected = quote?.status === 'rejected';
  const isCancellationWindowActive = quote?.cancellationLastDate
    ? new Date().getTime() <= new Date(quote?.cancellationLastDate).getTime()
    : true;

  const getStatusBadgeStyle = () => {
    if (isAccepted) {
      return {
        bg: COLORS.greenLightBg,
        text: COLORS.greenPrimary,
        border: COLORS.emeraldBorder,
      };
    }
    if (isCancelled || isRejected) {
      return {
        bg: COLORS.redLightBg,
        text: COLORS.error,
        border: COLORS.redBorder,
      };
    }
    return {
      bg: COLORS.goldLightBg,
      text: COLORS.primary,
      border: COLORS.goldBorder,
    };
  };

  const statusStyle = getStatusBadgeStyle();

  const handleProcessFlow = async () => {
    if (!cardDetails?.complete)
      return showErrorToast(
        'Payment Error',
        'Please enter valid card details.',
      );

    if (!isAcceptedTerms)
      return showErrorToast(
        'Terms Error',
        'Please agree to the terms and conditions.',
      );
    if (!signature)
      return showErrorToast(
        'Signature Required',
        'Please draw your signature in the box provided.',
      );

    setLoading(true);
    try {
      // 1. Get Secret from Pay API
      const payResponse = await customerService.payQuote(quote?._id);
      if (!payResponse.success || !payResponse.clientSecret)
        throw new Error('Payment initialization failed.');

      // 2. Stripe Payment
      const { error, paymentIntent } = await confirmPayment(
        payResponse.clientSecret,
        { paymentMethodType: 'Card' },
      );
      if (error) {
        console.error('Stripe Payment Error:--------------------', error);
        showErrorToast('Payment Error', error.message);
        setLoading(false);
        return;
      }

      // 3. Final Accept API
      if (
        paymentIntent?.status === 'Succeeded' ||
        paymentIntent?.status === 'RequiresCapture'
      ) {
        const acceptRes = await customerService.acceptQuote(quote?._id, {
          customerSignature: signature,
        });
        if (acceptRes) {
          showSuccessToast('Success', 'Payment successful and quote accepted!');
          onClose();
          navigation.goBack();
          if (onRefresh) onRefresh();
        }
      }
    } catch (e: any) {
      showErrorToast('Payment Error', e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelShipment = async () => {
    if (!cancelReason.trim()) {
      setCancelReasonError('Please enter a reason for cancellation.');
      return;
    }
    setCancelReasonError('');
    setLoading(true);
    try {
      const res = await customerService.cancelQuote(quote?._id, {
        reason: cancelReason.trim(),
      });
      if (res?.success) {
        showSuccessToast('Success', 'Shipment has been cancelled.');
        setIsCancelModalVisible(false);
        onClose();
        if (onRefresh) onRefresh();
      }
    } catch (_error) {
      showErrorToast('Error', 'Failed to cancel shipment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* TOP HANDLE BAR */}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <AppText style={styles.reviewLabel}>QUOTE REVIEW</AppText>
              <AppText style={styles.title}>Quote Details</AppText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeIcon}
              activeOpacity={0.7}
            >
              <AppIcon
                name={'X'}
                size={ICON_SIZE.sm}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            scrollEnabled={scrollEnabled}
          >
            {/* CANCELLATION TIMEFRAME BANNER */}
            {!isCancelled && !isRejected && quote?.cancellationLastDate && (
              <View style={styles.cancelBanner}>
                <AppIcon
                  name={'Clock'}
                  size={ICON_SIZE.sm}
                  color={COLORS.amberWarning}
                  style={{ marginRight: SPACING.xs }}
                />

                <AppText style={styles.cancelText}>
                  Cancel Window:{' '}
                  <AppText
                    style={{
                      fontFamily: FONTS.bold,
                      color: COLORS.amberWarning,
                    }}
                  >
                    {formatDate(
                      quote?.cancellationLastDate,
                      'MMM DD, YYYY · hh:mm A',
                    )}
                  </AppText>
                </AppText>
              </View>
            )}

            {/* HERO PRICE & STATUS CARD */}
            <View style={styles.heroCard}>
              <View style={styles.heroLeft}>
                <AppText style={styles.heroLabel}>TOTAL PRICE</AppText>
                <AppText style={styles.heroPrice}>
                  ${Number(quote?.totalPrice || 0).toLocaleString()}
                </AppText>
              </View>
              <View style={styles.heroRight}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: statusStyle.bg,
                      borderColor: statusStyle.border,
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.statusBadgeText,
                      { color: statusStyle.text },
                    ]}
                  >
                    {quote?.status?.toUpperCase() || 'Not Available'}
                  </AppText>
                </View>
              </View>
            </View>

            {/* QUOTE SUMMARY */}
            <View style={styles.cardContainer}>
              <AppText style={styles.cardTitle}>
                Overview & Payment Terms
              </AppText>
              <View style={styles.summaryGrid}>
                <SummaryBox
                  icon={'User'}
                  label="SHIPPER"
                  value={quote?.shipper?.name}
                />
                <SummaryBox
                  icon={'CreditCard'}
                  label="METHOD"
                  value={quote?.paymentMethod}
                />
                <SummaryBox
                  icon={'Calendar'}
                  label="DUE"
                  value={quote?.paymentDue}
                />
                <SummaryBox
                  icon={'DollarSign'}
                  label="STATUS"
                  value={quote?.paymentStatus}
                />
              </View>
            </View>

            {/* CONTRACTS / DOCUMENTS SECTION */}
            <QuoteContractsSection
              quote={quote}
              onClose={onClose}
              navigation={navigation}
            />

            {/* FORM: ONLY SHOWN IF PENDING */}
            {isPending && (
              <QuoteAcceptanceForm
                sigRef={sigRef}
                setScrollEnabled={setScrollEnabled}
                setCardDetails={setCardDetails}
                signature={signature}
                setSignature={setSignature}
                isAcceptedTerms={isAcceptedTerms}
                setIsAcceptedTerms={setIsAcceptedTerms}
              />
            )}

            {/* NOTES */}
            {quote?.notes && (
              <View style={styles.cardContainer}>
                <AppText style={styles.cardTitle}>Notes & Remarks</AppText>
                <AppText style={styles.notesText}>{quote?.notes}</AppText>
              </View>
            )}
          </ScrollView>

          {/* FOOTER ACTIONS */}
          <QuoteActionButtons
            isAccepted={isAccepted}
            quote={quote}
            isCancellationWindowActive={isCancellationWindowActive}
            isCompleted={isCompleted}
            setIsCancelModalVisible={setIsCancelModalVisible}
            isPending={isPending}
            isAcceptedTerms={isAcceptedTerms}
            signature={signature}
            cardDetails={cardDetails}
            loading={loading}
            handleProcessFlow={handleProcessFlow}
            isRejected={isRejected}
            isCancelled={isCancelled}
          />
        </View>
      </View>

      {/* CANCEL MODAL */}
      {isCancelModalVisible && (
        <CancelModal
          isCancelModalVisible={isCancelModalVisible}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          cancelReasonError={cancelReasonError}
          setCancelReasonError={setCancelReasonError}
          setIsCancelModalVisible={setIsCancelModalVisible}
          handleCancelShipment={handleCancelShipment}
        />
      )}
    </Modal>
  );
};

export default memo(QuoteDetailModal);
