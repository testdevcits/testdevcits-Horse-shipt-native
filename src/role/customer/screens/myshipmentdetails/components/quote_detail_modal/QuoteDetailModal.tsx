import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { formatDate } from '../../../../../../utils/helpers';
import SignatureScreen from 'react-native-signature-canvas';
import {
  COLORS,
  FONTS,
  
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../../../constants';
import { AppText, Input } from '../../../../../../components';
import { useNavigation } from '@react-navigation/native';
import customerService from '../../../../../../api/services/customerService';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import AppIcon, { IconName } from '../../../../../../components/AppIcon';
import styles from './styles.QuoteDetailModal';

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
        bg: '#FEF2F2',
        text: COLORS.error,
        border: '#FCA5A5',
      };
    }
    return {
      bg: COLORS.goldLightBg,
      text: COLORS.primary,
      border: '#FDE68A',
    };
  };

  const statusStyle = getStatusBadgeStyle();

  const handleProcessFlow = async () => {
    if (!cardDetails?.complete)
      return Alert.alert('Payment Error', 'Please enter valid card details.');
    if (!isAcceptedTerms)
      return Alert.alert(
        'Terms Error',
        'Please agree to the terms and conditions.',
      );
    if (!signature)
      return Alert.alert(
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
        Alert.alert('Payment Error', error.message);
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
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Payment successful and quote accepted!',
          });
          onClose();
          navigation.goBack();
          if (onRefresh) onRefresh();
        }
      }
    } catch (e: any) {
      Alert.alert('Process Failed', e.message || 'Something went wrong.');
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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Shipment has been cancelled.',
        });
        setIsCancelModalVisible(false);
        onClose();
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel shipment.');
    } finally {
      setLoading(false);
    }
  };

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
            {(quote?.contract?.url ||
              quote?.contract ||
              quote?.shipperContract?.url ||
              quote?.shipperContract) && (
              <View style={styles.cardContainer}>
                <AppText style={styles.cardTitle}>
                  Contracts & Documents
                </AppText>

                {(quote?.contract?.url ||
                  typeof quote?.contract === 'string') && (
                  <TouchableOpacity
                    style={styles.docItem}
                    activeOpacity={0.8}
                    onPress={() => {
                      const contractUrl =
                        typeof quote?.contract === 'string'
                          ? quote?.contract
                          : quote?.contract.url;
                      if (contractUrl) {
                        onClose();
                        navigation.navigate('PdfViewer', {
                          url: contractUrl,
                          title: 'Shipment Contract',
                        });
                      }
                    }}
                  >
                    <View style={styles.docLeftRow}>
                      <View style={styles.docIconBox}>
                        <AppIcon
                          name={'FileText'}
                          size={ICON_SIZE.sm}
                          color={COLORS.primary}
                        />
                      </View>
                      <View style={styles.docInfo}>
                        <AppText style={styles.docName}>
                          Shipment Contract
                        </AppText>
                        <AppText style={styles.docSub}>
                          Official shipment agreement
                        </AppText>
                      </View>
                    </View>
                    <View style={styles.docActionWrap}>
                      <AppText style={styles.docActionText}>View</AppText>
                      <AppIcon
                        name={'ChevronRight'}
                        size={ICON_SIZE.xs}
                        color={COLORS.primary}
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {(quote?.shipperContract?.url ||
                  typeof quote?.shipperContract === 'string') && (
                  <TouchableOpacity
                    style={[
                      styles.docItem,
                      (quote?.contract?.url ||
                        typeof quote?.contract === 'string') && {
                        marginTop: SPACING.sm,
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      const shipperUrl =
                        typeof quote?.shipperContract === 'string'
                          ? quote?.shipperContract
                          : quote?.shipperContract.url;
                      const docTitle =
                        quote?.shipperContract?.originalName || 'Not Available';
                      if (shipperUrl) {
                        onClose();
                        navigation.navigate('PdfViewer', {
                          url: shipperUrl,
                          title: docTitle,
                        });
                      }
                    }}
                  >
                    <View style={styles.docLeftRow}>
                      <View style={styles.docIconBox}>
                        <AppIcon
                          name={'FileText'}
                          size={ICON_SIZE.sm}
                          color={COLORS.primary}
                        />
                      </View>
                      <View style={styles.docInfo}>
                        <AppText style={styles.docName} numberOfLines={1}>
                          {quote?.shipperContract?.originalName ||
                            'Shipper Contract'}
                        </AppText>
                        <AppText style={styles.docSub}>
                          Uploaded contract terms
                        </AppText>
                      </View>
                    </View>
                    <View style={styles.docActionWrap}>
                      <AppText style={styles.docActionText}>View</AppText>
                      <AppIcon
                        name={'ChevronRight'}
                        size={ICON_SIZE.xs}
                        color={COLORS.primary}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* FORM: ONLY SHOWN IF PENDING */}
            {isPending && (
              <View style={[styles.cardContainer, styles.highlightCard]}>
                <View style={styles.highlightHeader}>
                  <AppIcon
                    name={'ShieldCheck'}
                    size={ICON_SIZE.sm}
                    color={COLORS.primary}
                  />
                  <AppText style={styles.highlightTitle}>
                    Acceptance & Payment
                  </AppText>
                </View>
                <AppText style={styles.highlightSub}>
                  Enter your card details and sign below to accept this quote?.
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
                      <AppIcon
                        name={'Check'}
                        size={ICON_SIZE.xs}
                        color={COLORS.white}
                      />
                      <AppText style={styles.capturedText}>Captured</AppText>
                    </View>
                  ) : (
                    <AppText style={styles.signatureSub}>
                      Draw inside box
                    </AppText>
                  )}
                </View>
                <View style={styles.signatureWrap}>
                  <SignatureScreen
                    ref={sigRef}
                    onBegin={() => setScrollEnabled(false)}
                    onEnd={() => {
                      setScrollEnabled(true);
                      sigRef.current.readSignature();
                    }}
                    onOK={setSignature}
                    webStyle={`.m-signature-pad--footer {display: none;}`}
                  />
                </View>
                {signature && (
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => {
                      sigRef.current.clearSignature();
                      setSignature(null);
                    }}
                  >
                    <AppIcon
                      name={'Trash2'}
                      size={ICON_SIZE.xs}
                      color={COLORS.error}
                    />
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
                    style={[
                      styles.checkbox,
                      isAcceptedTerms && styles.checkboxActive,
                    ]}
                  >
                    {isAcceptedTerms && (
                      <AppIcon
                        name={'Check'}
                        size={ICON_SIZE.xs}
                        color={COLORS.white}
                      />
                    )}
                  </View>
                  <AppText style={styles.termsLabel}>
                    I have reviewed and agree to the terms, conditions, and
                    cancellation policy.
                  </AppText>
                </TouchableOpacity>
              </View>
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
          <View style={styles.footerActionContainer}>
            {isAccepted && !quote?.isCancelled && (
              <View style={styles.acceptedContainer}>
                <View style={styles.successMessageCard}>
                  <AppIcon
                    name={'CheckCircle2'}
                    size={ICON_SIZE.md}
                    color={COLORS.greenPrimary}
                  />
                  <View style={{ flex: 1 }}>
                    <AppText style={styles.successTitle}>
                      Quote Accepted & Secured
                    </AppText>
                    <AppText style={styles.successSub}>
                      Your shipment is confirmed.
                    </AppText>
                  </View>
                </View>
                {isCancellationWindowActive && isCompleted == false && (
                  <TouchableOpacity
                    style={styles.cancelBookingBtn}
                    activeOpacity={0.8}
                    onPress={() => setIsCancelModalVisible(true)}
                  >
                    <AppIcon
                      name={'AlertCircle'}
                      size={ICON_SIZE.sm}
                      color={COLORS.error}
                    />
                    <AppText style={styles.cancelBookingText}>
                      Cancel Shipment
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {isPending && (
              <TouchableOpacity
                style={[
                  styles.acceptBtn,
                  (!isAcceptedTerms ||
                    !signature ||
                    !cardDetails?.complete ||
                    loading) &&
                    styles.disabledBtn,
                ]}
                disabled={
                  !isAcceptedTerms ||
                  !signature ||
                  !cardDetails?.complete ||
                  loading
                }
                activeOpacity={0.85}
                onPress={handleProcessFlow}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <View style={styles.acceptBtnInner}>
                    <AppIcon
                      name={'ShieldCheck'}
                      size={ICON_SIZE.sm}
                      color={COLORS.white}
                    />
                    <AppText style={styles.acceptBtnText}>
                      Pay & Accept Quote
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            )}

            {(isRejected || isCancelled) && (
              <View style={styles.inactiveState}>
                <AppText style={styles.inactiveText}>
                  This quote is no longer active.
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* CANCEL MODAL */}
      {isCancelModalVisible && (
        <Modal visible={isCancelModalVisible} transparent animationType="fade">
          <View style={styles.promptOverlay}>
            <View style={styles.promptContent}>
              <AppText style={styles.promptTitle}>Cancel Shipment</AppText>
              <AppText style={styles.promptSub}>
                Please state the reason for cancelling this shipment quote:
              </AppText>
              <Input
                placeholder="Enter reason here..."
                multiline
                value={cancelReason}
                onChangeText={text => {
                  setCancelReason(text);
                  if (cancelReasonError) setCancelReasonError('');
                }}
                containerStyle={{ marginBottom: SPACING.md }}
                error={cancelReasonError}
              />
              <View style={styles.promptFooter}>
                <TouchableOpacity
                  style={styles.promptBtnSecondary}
                  onPress={() => setIsCancelModalVisible(false)}
                >
                  <AppText style={styles.promptBtnTextSecondary}>
                    Keep Booking
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.promptBtnPrimary}
                  onPress={handleCancelShipment}
                >
                  <AppText style={styles.promptBtnTextPrimary}>
                    Confirm Cancel
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

export default QuoteDetailModal;
