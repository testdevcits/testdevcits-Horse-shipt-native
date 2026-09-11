import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
   
} from 'react-native';
 
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { AppText } from '../../../../components';
import {
  COLORS,
   
  FONT_SIZE,
} from '../../../../constants';
import {
  ShipperStatus,
  SubscriptionStatus,
  SubscriptionPlansData,
  PlanItem,
} from '../../../../hooks/useShipperSubscription';
import shipperService from '../../../../api/services/shipperService';
import Toast from 'react-native-toast-message';
import styles from './styles.subscriptionRequiredModal';
import AppIcon from '../../../../components/AppIcon';

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
  const [step, setStep] = useState<'plan_selection' | 'add_card'>(
    'plan_selection',
  );
  const [selectedPlanType, setSelectedPlanType] = useState<
    'daily' | 'monthly' | 'yearly'
  >('monthly');
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
  const currencySymbol =
    selectedPlan?.currency?.toUpperCase() === 'USD' ? '$' : '$';
  const planAmount =
    selectedPlan?.amount ?? (selectedPlanType === 'yearly' ? 219.89 : 1);
  const intervalLabel =
    selectedPlanType === 'daily'
      ? 'day'
      : selectedPlanType === 'yearly'
      ? 'year'
      : 'month';

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
          text2:
            res?.message || 'Failed to process subscription. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('Subscription Creation Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error?.response?.data?.message ||
          'Something went wrong while subscribing.',
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
      const setupIntentRes = await shipperService
        .getSetupIntent()
        .catch(() => null);
      const clientSecret = setupIntentRes?.clientSecret;

      if (clientSecret && clientSecret.includes('_secret_')) {
        const { setupIntent, error: stripeError } = await confirmSetupIntent(
          clientSecret,
          {
            paymentMethodType: 'Card',
          },
        );
        if (stripeError) {
          setIsSavingCard(false);
          setCardError(
            stripeError.message || 'Failed to process card details.',
          );
          return;
        }
        paymentMethodId =
          typeof setupIntent?.paymentMethod === 'string'
            ? setupIntent.paymentMethod
            : (setupIntent?.paymentMethod as any)?.id || setupIntent?.id || '';
      }

      if (!paymentMethodId) {
        const { paymentMethod, error: stripeError } = await createPaymentMethod(
          {
            paymentMethodType: 'Card',
          },
        );
        if (stripeError) {
          setIsSavingCard(false);
          setCardError(
            stripeError.message || 'Failed to process card details.',
          );
          return;
        }
        paymentMethodId = paymentMethod?.id || '';
      }

      if (paymentMethodId) {
        const saveRes = await shipperService.savePaymentMethod({
          paymentMethodId,
        });
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
      setCardError(
        err?.response?.data?.message ||
          'Failed to save card. Please try again.',
      );
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
                <AppIcon name={"Zap"} size={13} color={COLORS.white} fill={COLORS.white} />
                <AppText style={styles.requiredBadgeText}>
                  SUBSCRIPTION REQUIRED
                </AppText>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                disabled={isSubmitting || isSavingCard}
              >
                <AppIcon name={"X"} size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Title & Price Row */}
            <View style={styles.headerTitleRow}>
              <View style={styles.headerTitleCol}>
                <AppText style={styles.headerTitle}>Unlock Full Access</AppText>

                {/* Sub Trial Pill */}
                <View style={styles.trialPillRow}>
                  <View style={styles.trialPill}>
                    <AppIcon name={"ShieldCheck"} size={13} color={COLORS.amberLightBg} />
                    <AppText style={styles.trialPillText}>
                      {trialDays}-day free trial
                    </AppText>
                  </View>
                  <AppText style={styles.trialSubText}>
                    Cancel anytime • No hidden charges
                  </AppText>
                </View>
              </View>

              {/* Top Right Price Tag */}
              <View style={styles.priceTagBox}>
                <AppText style={styles.priceTagAmount}>
                  {currencySymbol}
                  {planAmount}
                </AppText>
                <AppText style={styles.priceTagInterval}>
                  /{intervalLabel}
                </AppText>
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
                  <AppIcon name={"CreditCard"} size={20} color={COLORS.textPrimary} />
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
                    <AppIcon name={"AlertCircle"} size={15} color={COLORS.redPrimary} />
                    <AppText style={styles.errorBannerText}>
                      {cardError}
                    </AppText>
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
                      <AppIcon name={"Check"} size={18} color={COLORS.white} />
                      <AppText style={styles.actionBtnText}>
                        Save Card & Continue
                      </AppText>
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
                  <AppText style={styles.sectionHeaderLabel}>
                    WHAT'S INCLUDED
                  </AppText>

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
                          <AppIcon name={"CheckCircle2"}
                            size={16}
                            color={COLORS.brandBrown}
                            fill={COLORS.goldLightBg}
                          />
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
                    <AppText
                      style={[
                        styles.planTabName,
                        selectedPlanType === 'daily' &&
                          styles.planTabTextActive,
                      ]}
                    >
                      ONE DAY
                    </AppText>
                    <AppText
                      style={[
                        styles.planTabPrice,
                        selectedPlanType === 'daily' &&
                          styles.planTabTextActive,
                      ]}
                    >
                      {currencySymbol}
                      {plansData?.daily?.amount ?? 1}
                    </AppText>
                  </TouchableOpacity>

                  {/* Monthly Plan */}
                  <TouchableOpacity
                    style={[
                      styles.planTabCard,
                      selectedPlanType === 'monthly' &&
                        styles.planTabCardActive,
                    ]}
                    onPress={() => setSelectedPlanType('monthly')}
                    activeOpacity={0.85}
                  >
                    <AppText
                      style={[
                        styles.planTabName,
                        selectedPlanType === 'monthly' &&
                          styles.planTabTextActive,
                      ]}
                    >
                      MONTHLY
                    </AppText>
                    <AppText
                      style={[
                        styles.planTabPrice,
                        selectedPlanType === 'monthly' &&
                          styles.planTabTextActive,
                      ]}
                    >
                      {currencySymbol}
                      {plansData?.monthly?.amount ?? 1}
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
                    <AppText
                      style={[
                        styles.planTabName,
                        selectedPlanType === 'yearly' &&
                          styles.planTabTextActive,
                      ]}
                    >
                      YEARLY
                    </AppText>
                    <AppText
                      style={[
                        styles.planTabPrice,
                        selectedPlanType === 'yearly' &&
                          styles.planTabTextActive,
                      ]}
                    >
                      {currencySymbol}
                      {plansData?.yearly?.amount ?? 219.89}
                    </AppText>
                  </TouchableOpacity>
                </View>

                {/* PAYMENT METHOD WARNING (If no card added) */}
                {!shipperStatus.hasCard && (
                  <View style={styles.cardWarningBox}>
                    <View style={styles.cardWarningIconBox}>
                      <AppIcon name={"AlertCircle"} size={18} color={COLORS.amberWarning} />
                    </View>
                    <View style={styles.cardWarningTextCol}>
                      <AppText style={styles.cardWarningTitle}>
                        Payment Method Required
                      </AppText>
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
                    <AppText style={styles.trialNoteBold}>
                      {trialDays}-day free trial
                    </AppText>
                    . After the trial, billing is {currencySymbol}
                    {planAmount}/{intervalLabel}.
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
                      {!shipperStatus.hasCard && (
                        <AppIcon name={"CreditCard"} size={18} color={COLORS.white} />
                      )}
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
                  {currencySymbol}
                  {planAmount}/{intervalLabel} after trial • Cancel anytime
                </AppText>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SubscriptionRequiredModal;
