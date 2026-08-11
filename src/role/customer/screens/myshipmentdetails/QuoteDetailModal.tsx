import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  CreditCard,
  Check,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Trash2,
  User,
  Clock,
  Calendar,
  DollarSign,
} from 'lucide-react-native';
import { formatDate } from '../../../../utils/helpers';
import SignatureScreen from 'react-native-signature-canvas';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../constants';
import { AppText, Input } from '../../../../components';
import { useNavigation } from '@react-navigation/native';
import customerService from '../../../../api/services/customerService';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';

const QuoteDetailModal = ({ visible, quote, onClose, onRefresh, isCompleted }: any) => {
  console.log("====QuoteDetailModal=====", quote)
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
      if (res.success) {
        Alert.alert('Success', 'Shipment has been cancelled.');
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
    icon: any;
    label: string;
    value: any;
  }) => (
    <View style={styles.summaryItem}>
      <View style={styles.summaryItemHeader}>
        <Icon size={ICON_SIZE.xs} color={COLORS.primary} />
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
              <X size={ICON_SIZE.sm} color={COLORS.textPrimary} />
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
                <Clock size={ICON_SIZE.sm} color={COLORS.amberWarning} style={{ marginRight: SPACING.xs }} />
                <AppText style={styles.cancelText}>
                  Cancel Window:{' '}
                  <AppText style={{ fontFamily: FONTS.bold, color: COLORS.amberWarning }}>
                    {formatDate(quote?.cancellationLastDate, 'MMM DD, YYYY · hh:mm A')}
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
                    style={[styles.statusBadgeText, { color: statusStyle.text }]}
                  >
                    {quote?.status?.toUpperCase() || 'PENDING'}
                  </AppText>
                </View>
              </View>
            </View>

            {/* QUOTE SUMMARY */}
            <View style={styles.cardContainer}>
              <AppText style={styles.cardTitle}>Overview & Payment Terms</AppText>
              <View style={styles.summaryGrid}>
                <SummaryBox
                  icon={User}
                  label="SHIPPER"
                  value={quote?.shipper?.name}
                />
                <SummaryBox
                  icon={CreditCard}
                  label="METHOD"
                  value={quote?.paymentMethod}
                />
                <SummaryBox
                  icon={Calendar}
                  label="DUE"
                  value={quote?.paymentDue}
                />
                <SummaryBox
                  icon={DollarSign}
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
                  <AppText style={styles.cardTitle}>Contracts & Documents</AppText>

                  {(quote?.contract?.url || typeof quote?.contract === 'string') && (
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
                          <FileText size={ICON_SIZE.sm} color={COLORS.primary} />
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
                        <ChevronRight size={ICON_SIZE.xs} color={COLORS.primary} />
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
                            quote?.shipperContract?.originalName || 'Shipper Contract';
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
                            <FileText size={ICON_SIZE.sm} color={COLORS.primary} />
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
                          <ChevronRight size={ICON_SIZE.xs} color={COLORS.primary} />
                        </View>
                      </TouchableOpacity>
                    )}
                </View>
              )}

            {/* FORM: ONLY SHOWN IF PENDING */}
            {isPending && (
              <View style={[styles.cardContainer, styles.highlightCard]}>
                <View style={styles.highlightHeader}>
                  <ShieldCheck size={ICON_SIZE.sm} color={COLORS.primary} />
                  <AppText style={styles.highlightTitle}>
                    Acceptance & Payment
                  </AppText>
                </View>
                <AppText style={styles.highlightSub}>
                  Enter your card details and sign below to accept this quote?.
                </AppText>

                {/* 1. STRIPE CARD FIELD */}
                <View style={styles.inputLabelRow}>
                  <CreditCard size={ICON_SIZE.sm} color={COLORS.grey700} />
                  <AppText style={styles.inputLabel}>Card Details</AppText>
                </View>
                <View style={styles.stripeCardContainer}>
                  <CardField
                    postalCodeEnabled={true}
                    style={styles.stripeCardField}
                    cardStyle={{
                      backgroundColor: '#FFFFFF',
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
                      <Check size={ICON_SIZE.xs} color={COLORS.white} />
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
                    <Trash2 size={ICON_SIZE.xs} color={COLORS.error} />
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
                      <Check size={ICON_SIZE.xs} color={COLORS.white} />
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
                  <CheckCircle2 size={ICON_SIZE.md} color={COLORS.greenPrimary} />
                  <View style={{ flex: 1 }}>
                    <AppText style={styles.successTitle}>
                      Quote Accepted & Secured
                    </AppText>
                    <AppText style={styles.successSub}>
                      Your shipment is confirmed.
                    </AppText>
                  </View>
                </View>
                {isCancellationWindowActive && (
                  isCompleted == false && <TouchableOpacity
                    style={styles.cancelBookingBtn}
                    activeOpacity={0.8}
                    onPress={() => setIsCancelModalVisible(true)}
                  >
                    <AlertCircle size={ICON_SIZE.sm} color={COLORS.error} />
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
                    <ShieldCheck size={ICON_SIZE.sm} color={COLORS.white} />
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
      {
        isCancelModalVisible &&
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
      }

    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.slate50,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    height: '90%',
    overflow: 'hidden',
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.white,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.slate300,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  headerTitleWrap: { flex: 1 },
  reviewLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  closeIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.amberLightBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.amberBorder,
  },
  cancelText: {
    color: COLORS.amberWarning,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    flex: 1,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: SPACING.md,
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  heroLeft: { flex: 1 },
  heroLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  heroPrice: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  heroRight: { alignItems: 'flex-end' },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },

  cardContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: SPACING.md,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  summaryItem: {
    width: '48%',
    padding: SPACING.sm,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFFDF9',
  },
  docLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  docIconBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docInfo: { flex: 1 },
  docName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
  },
  docSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginTop: 1,
  },
  docActionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  docActionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },

  highlightCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFDF7',
    borderWidth: 1.5,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 2,
  },
  highlightTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  highlightSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.sm,
  },

  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },

  stripeCardContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  stripeCardField: {
    width: '100%',
    height: 46,
  },

  signatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  signatureSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  capturedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.greenPrimary,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  capturedText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  signatureWrap: {
    height: 140,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginTop: SPACING.xs,
    paddingVertical: 2,
  },
  clearText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.xs,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: { backgroundColor: COLORS.primary },
  termsLabel: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    lineHeight: 16,
  },

  notesText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  footerActionContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  acceptedContainer: { gap: SPACING.sm },
  successMessageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLightBg,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
  },
  successTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.emeraldDark,
  },
  successSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.emeraldDark,
    marginTop: 1,
  },

  cancelBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: SPACING.xs,
    backgroundColor: '#FEF2F2',
  },
  cancelBookingText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },

  inactiveState: {
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.sm,
  },
  inactiveText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },

  acceptBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  disabledBtn: {
    opacity: 0.6,
    backgroundColor: COLORS.black,
    shadowOpacity: 0,
    elevation: 0,
  },
  acceptBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
  },

  promptOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  promptContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  promptTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  promptSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  reasonInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    height: 80,
    textAlignVertical: 'top',
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  promptFooter: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  promptBtnSecondary: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    backgroundColor: '#F1F5F9',
  },
  promptBtnTextSecondary: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
  promptBtnPrimary: {
    flex: 1.5,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.error,
  },
  promptBtnTextPrimary: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});

export default QuoteDetailModal;
