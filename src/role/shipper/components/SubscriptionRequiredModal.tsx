import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,

} from 'react-native';
import {
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  Check,
} from 'lucide-react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { AppText } from '../../../components';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../constants';
import {
  ShipperStatus,
  SubscriptionStatus,
  SubscriptionPlansData,
  PlanItem,
} from '../../../hooks/useShipperSubscription';
import shipperService from '../../../api/services/shipperService';
import Toast from 'react-native-toast-message';

interface SubscriptionRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  shipperStatus: ShipperStatus;
  subscriptionStatus: SubscriptionStatus;
  plansData: SubscriptionPlansData | null;
  onOpenAddCardModal?: () => void;
  onSubscriptionSuccess?: () => void;
}

const SubscriptionRequiredModal: React.FC<SubscriptionRequiredModalProps> = ({
  visible,
  onClose,
  shipperStatus,
  subscriptionStatus,
  plansData,
  onOpenAddCardModal,
  onSubscriptionSuccess,
}) => {
  const [step, setStep] = useState<'plan_selection' | 'add_card'>('plan_selection');
  const [selectedPlanType, setSelectedPlanType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stripe Card state for inline card addition
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [cardError, setCardError] = useState('');
  const [isSavingCard, setIsSavingCard] = useState(false);

  const { confirmSetupIntent, createPaymentMethod } = useStripe();

  useEffect(() => {
    if (visible) {
      setStep('plan_selection');
      setCardError('');
      setIsSubmitting(false);
      setIsSavingCard(false);
    }
  }, [visible]);

  // Extract selected plan info from plansData API response
  const getSelectedPlan = (): PlanItem | null => {
    if (!plansData) return null;
    if (selectedPlanType === 'daily') return plansData.daily || null;
    if (selectedPlanType === 'yearly') return plansData.yearly || null;
    return plansData.monthly || null; // default monthly
  };

  const selectedPlan = getSelectedPlan();
  const trialDays = plansData?.trialDays ?? 1;
  const currencySymbol = selectedPlan?.currency?.toUpperCase() === 'USD' ? '$' : '$';
  const planAmount = selectedPlan?.amount ?? (selectedPlanType === 'yearly' ? 219.89 : 1);
  const intervalLabel = selectedPlanType === 'daily' ? 'day' : selectedPlanType === 'yearly' ? 'year' : 'month';

  const handleActionPress = async () => {
    // If shipper has no payment card, switch to inline Add Payment Method step
    if (!shipperStatus.hasCard) {
      if (onOpenAddCardModal) {
        onOpenAddCardModal();
      } else {
        setStep('add_card');
      }
      return;
    }

    // Create the subscription using Stripe API
    setIsSubmitting(true);
    try {
      const res = await shipperService.createSubscription({
        priceId: selectedPlan?.priceId,
        planType: selectedPlanType,
      });

      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Subscription Activated!',
          text2: `Your ${trialDays}-day free trial is now active.`,
        });
        if (onSubscriptionSuccess) {
          onSubscriptionSuccess();
        }
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Subscription Error',
          text2: res?.message || 'Failed to process subscription. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('Subscription Creation Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Something went wrong while subscribing.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCardAndContinue = async () => {
    if (!cardDetails?.complete) {
      setCardError('Please enter complete and valid card details.');
      return;
    }
    setCardError('');
    setIsSavingCard(true);

    try {
      let paymentMethodId = '';
      const setupIntentRes = await shipperService.getSetupIntent().catch(() => null);
      const clientSecret = setupIntentRes?.clientSecret;

      if (clientSecret && clientSecret.includes('_secret_')) {
        const { setupIntent, error: stripeError } = await confirmSetupIntent(clientSecret, {
          paymentMethodType: 'Card',
        });
        if (stripeError) {
          setIsSavingCard(false);
          setCardError(stripeError.message || 'Failed to process card details.');
          return;
        }
        paymentMethodId =
          typeof setupIntent?.paymentMethod === 'string'
            ? setupIntent.paymentMethod
            : (setupIntent?.paymentMethod as any)?.id || setupIntent?.id || '';
      }

      if (!paymentMethodId) {
        const { paymentMethod, error: stripeError } = await createPaymentMethod({
          paymentMethodType: 'Card',
        });
        if (stripeError) {
          setIsSavingCard(false);
          setCardError(stripeError.message || 'Failed to process card details.');
          return;
        }
        paymentMethodId = paymentMethod?.id || '';
      }

      if (paymentMethodId) {
        const saveRes = await shipperService.savePaymentMethod({ paymentMethodId });
        if (saveRes?.success) {
          shipperStatus.hasCard = true;
          Toast.show({
            type: 'success',
            text1: 'Card Saved!',
            text2: 'Your payment method has been attached.',
          });
          setStep('plan_selection');
          if (onSubscriptionSuccess) {
            onSubscriptionSuccess();
          }
        } else {
          setCardError(saveRes?.message || 'Failed to save payment method.');
        }
      }
    } catch (err: any) {
      console.error('Card saving error:', err);
      setCardError(err?.response?.data?.message || 'Failed to save card. Please try again.');
    } finally {
      setIsSavingCard(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* TOP GOLD HEADER BANNER */}
          <View style={styles.headerBanner}>
            <View style={styles.headerTopRow}>
              {/* Top Left Badge */}
              <View style={styles.requiredBadge}>
                <Zap size={13} color={COLORS.white} fill={COLORS.white} />
                <AppText style={styles.requiredBadgeText}>SUBSCRIPTION REQUIRED</AppText>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                disabled={isSubmitting || isSavingCard}
              >
                <X size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Title & Price Row */}
            <View style={styles.headerTitleRow}>
              <View style={styles.headerTitleCol}>
                <AppText style={styles.headerTitle}>Unlock Full Access</AppText>

                {/* Sub Trial Pill */}
                <View style={styles.trialPillRow}>
                  <View style={styles.trialPill}>
                    <ShieldCheck size={13} color={COLORS.amberLightBg} />
                    <AppText style={styles.trialPillText}>{trialDays}-day free trial</AppText>
                  </View>
                  <AppText style={styles.trialSubText}>Cancel anytime • No hidden charges</AppText>
                </View>
              </View>

              {/* Top Right Price Tag */}
              <View style={styles.priceTagBox}>
                <AppText style={styles.priceTagAmount}>
                  {currencySymbol}{planAmount}
                </AppText>
                <AppText style={styles.priceTagInterval}>/{intervalLabel}</AppText>
              </View>
            </View>
          </View>

          {/* SCROLLABLE BODY */}
          <ScrollView
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {step === 'add_card' ? (
              /* STEP 2: ADD PAYMENT METHOD (MATCHING 2ND SCREENSHOT) */
              <View style={{ width: '100%' }}>
                {/* Header Title Row */}
                <View style={styles.addCardHeaderRow}>
                  <CreditCard size={20} color={COLORS.textPrimary} />
                  <AppText style={styles.addCardHeaderTitle}>Add Payment Method</AppText>
                </View>
                <AppText style={styles.addCardSubTitle}>
                  You won't be charged until your trial ends
                </AppText>

                {/* Card Input Error Banner */}
                {!!cardError && (
                  <View style={styles.errorBanner}>
                    <AlertCircle size={15} color={COLORS.redPrimary} />
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
                    onCardChange={details => setCardDetails(details)}
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
                  onPress={handleSaveCardAndContinue}
                  disabled={isSavingCard}
                  activeOpacity={0.88}
                >
                  {isSavingCard ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <View style={styles.actionBtnContent}>
                      <Check size={18} color={COLORS.white} />
                      <AppText style={styles.actionBtnText}>Save Card & Continue</AppText>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Back Button */}
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setStep('plan_selection')}
                  disabled={isSavingCard}
                >
                  <AppText style={styles.backBtnText}>Back</AppText>
                </TouchableOpacity>
              </View>
            ) : (
              /* STEP 1: PLAN SELECTION & WHAT'S INCLUDED (MATCHING 1ST SCREENSHOT) */
              <>
                {/* WHAT'S INCLUDED CHECKLIST */}
                <View style={styles.includedSection}>
                  <AppText style={styles.sectionHeaderLabel}>WHAT'S INCLUDED</AppText>

                  <View style={styles.checkListContainer}>
                    {[
                      'Full shipment management system',
                      'Quote handling & real-time tracking',
                      'Instant notifications & updates',
                      'Priority customer support',
                      'Unlimited shipments & quotes',
                    ].map((item, idx) => (
                      <View key={idx} style={styles.checkItemRow}>
                        <View style={styles.checkIconSquare}>
                          <CheckCircle2 size={16} color={COLORS.brandBrown} fill={COLORS.goldLightBg} />
                        </View>
                        <AppText style={styles.checkItemText}>{item}</AppText>
                      </View>
                    ))}
                  </View>
                </View>

                {/* PLAN SELECTOR TABS */}
                <View style={styles.planTabsRow}>
                  {/* Daily Plan */}
                  <TouchableOpacity
                    style={[
                      styles.planTabCard,
                      selectedPlanType === 'daily' && styles.planTabCardActive,
                    ]}
                    onPress={() => setSelectedPlanType('daily')}
                    activeOpacity={0.85}
                  >
                    <AppText style={[styles.planTabName, selectedPlanType === 'daily' && styles.planTabTextActive]}>
                      ONE DAY
                    </AppText>
                    <AppText style={[styles.planTabPrice, selectedPlanType === 'daily' && styles.planTabTextActive]}>
                      {currencySymbol}{plansData?.daily?.amount ?? 1}
                    </AppText>
                  </TouchableOpacity>

                  {/* Monthly Plan */}
                  <TouchableOpacity
                    style={[
                      styles.planTabCard,
                      selectedPlanType === 'monthly' && styles.planTabCardActive,
                    ]}
                    onPress={() => setSelectedPlanType('monthly')}
                    activeOpacity={0.85}
                  >
                    <AppText style={[styles.planTabName, selectedPlanType === 'monthly' && styles.planTabTextActive]}>
                      MONTHLY
                    </AppText>
                    <AppText style={[styles.planTabPrice, selectedPlanType === 'monthly' && styles.planTabTextActive]}>
                      {currencySymbol}{plansData?.monthly?.amount ?? 1}
                    </AppText>
                  </TouchableOpacity>

                  {/* Yearly Plan */}
                  <TouchableOpacity
                    style={[
                      styles.planTabCard,
                      selectedPlanType === 'yearly' && styles.planTabCardActive,
                    ]}
                    onPress={() => setSelectedPlanType('yearly')}
                    activeOpacity={0.85}
                  >
                    <AppText style={[styles.planTabName, selectedPlanType === 'yearly' && styles.planTabTextActive]}>
                      YEARLY
                    </AppText>
                    <AppText style={[styles.planTabPrice, selectedPlanType === 'yearly' && styles.planTabTextActive]}>
                      {currencySymbol}{plansData?.yearly?.amount ?? 219.89}
                    </AppText>
                  </TouchableOpacity>
                </View>

                {/* PAYMENT METHOD WARNING (If no card added) */}
                {!shipperStatus.hasCard && (
                  <View style={styles.cardWarningBox}>
                    <View style={styles.cardWarningIconBox}>
                      <AlertCircle size={18} color={COLORS.amberWarning} />
                    </View>
                    <View style={styles.cardWarningTextCol}>
                      <AppText style={styles.cardWarningTitle}>Payment Method Required</AppText>
                      <AppText style={styles.cardWarningSub}>
                        Add a card to start your free trial
                      </AppText>
                    </View>
                  </View>
                )}

                {/* TRIAL & BILLING NOTE BOX */}
                <View style={styles.trialNoteBox}>
                  <AppText style={styles.trialNoteText}>
                    You won't be charged during your{' '}
                    <AppText style={styles.trialNoteBold}>{trialDays}-day free trial</AppText>. After the
                    trial, billing is {currencySymbol}{planAmount}/{intervalLabel}.
                  </AppText>
                </View>

                {/* ACTION BUTTON */}
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleActionPress}
                  disabled={isSubmitting}
                  activeOpacity={0.88}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <View style={styles.actionBtnContent}>
                      {!shipperStatus.hasCard && <CreditCard size={18} color={COLORS.white} />}
                      <AppText style={styles.actionBtnText}>
                        {!shipperStatus.hasCard
                          ? 'Add Payment Method'
                          : `Start ${trialDays}-day free trial`}
                      </AppText>
                    </View>
                  )}
                </TouchableOpacity>

                {/* FOOTER SUBTEXT */}
                <AppText style={styles.footerSubText}>
                  {currencySymbol}{planAmount}/{intervalLabel} after trial • Cancel anytime
                </AppText>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },

  // HEADER BANNER
  headerBanner: {
    backgroundColor: COLORS.brandBrown,
    padding: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  requiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  requiredBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.title,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  trialPillRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  trialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    marginBottom: 4,
  },
  trialPillText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.amberLightBg,
  },
  trialSubText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  priceTagBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTagAmount: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    lineHeight: 24,
  },
  priceTagInterval: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: 'rgba(255, 255, 255, 0.85)',
  },

  // BODY CONTENT
  bodyContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },

  // STEP 2: ADD CARD STYLES
  addCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 2,
  },
  addCardHeaderTitle: {
    fontSize: FONT_SIZE.md + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  addCardSubTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.redLightBg,
    borderColor: COLORS.redBorder,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  errorBannerText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.redPrimary,
    flex: 1,
  },
  stripeCardContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  stripeCardField: {
    width: '100%',
    height: 44,
  },
  securityNoteBox: {
    backgroundColor: COLORS.goldLightBg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brandBrown,
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  securityNoteText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldDarkText,
    lineHeight: 18,
  },
  backBtn: {
    alignSelf: 'center',
    paddingVertical: SPACING.xs,
    marginTop: SPACING.xs,
  },
  backBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },

  // STEP 1: INCLUDED SECTION
  includedSection: {
    backgroundColor: COLORS.slate50,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeaderLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
    letterSpacing: 0.8,
    marginBottom: SPACING.xs + 2,
  },
  checkListContainer: {
    gap: SPACING.xs + 2,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  checkIconSquare: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkItemText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },

  // PLAN TABS
  planTabsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  planTabCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  planTabCardActive: {
    borderColor: COLORS.brandBrown,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.5,
  },
  planTabName: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  planTabPrice: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  planTabTextActive: {
    color: COLORS.goldDarkText,
  },

  // PAYMENT METHOD WARNING
  cardWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.amberLightBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.amberBorder,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  cardWarningIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.amberLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWarningTextCol: {
    flex: 1,
  },
  cardWarningTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.amberWarning,
  },
  cardWarningSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.amberWarning,
    marginTop: 1,
  },

  // TRIAL NOTE
  trialNoteBox: {
    backgroundColor: COLORS.goldLightBg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brandBrown,
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  trialNoteText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldDarkText,
    lineHeight: 18,
  },
  trialNoteBold: {
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },

  // ACTION BUTTON
  actionBtn: {
    width: '100%',
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    shadowColor: COLORS.brandBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  actionBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionBtnText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  footerSubText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default SubscriptionRequiredModal;
