import React, { useState, useEffect, memo } from 'react';
import { Modal, View, TouchableOpacity, ScrollView } from 'react-native';

import { useStripe } from '@stripe/stripe-react-native';
import { AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import {
  ShipperStatus,
  SubscriptionStatus,
  SubscriptionPlansData,
  PlanItem,
} from '../../../../hooks/useShipperSubscription';
import shipperService from '../../../../api/services/shipperService';

import styles from './styles.subscriptionRequiredModal';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import SubscriptionPlanSelectionStep from './components/SubscriptionPlanSelectionStep';
import SubscriptionAddCardStep from './components/SubscriptionAddCardStep';

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
  subscriptionStatus: _subscriptionStatus,
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
    return plansData.monthly || null;
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
    if (!shipperStatus.hasCard) {
      if (onOpenAddCardModal) {
        onOpenAddCardModal();
      } else {
        setStep('add_card');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await shipperService.createSubscription({
        priceId: selectedPlan?.priceId,
        planType: selectedPlanType,
      });

      if (res?.success) {
        showSuccessToast(
          'Subscription Activated!',
          `Your ${trialDays}-day free trial is now active.`,
        );

        if (onSubscriptionSuccess) {
          onSubscriptionSuccess();
        }
        onClose();
      } else {
        showErrorToast(
          'Subscription Error',
          res?.message || 'Failed to process subscription. Please try again.',
        );
      }
    } catch (error: any) {
      console.error('Subscription Creation Error:', error);

      const errMessage =
        typeof error === 'string'
          ? error
          : error?.message ||
            error?.response?.data?.message ||
            error?.response?.data?.errors?.[0] ||
            'Something went wrong while subscribing.';

      showErrorToast('Subscription Error', errMessage);
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

          showSuccessToast(
            'Card Saved!',
            'Your payment method has been attached.',
          );
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
                <AppIcon
                  name={'Zap'}
                  size={13}
                  color={COLORS.white}
                  fill={COLORS.white}
                />
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
                <AppIcon name={'X'} size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Title & Price Row */}
            <View style={styles.headerTitleRow}>
              <View style={styles.headerTitleCol}>
                <AppText style={styles.headerTitle}>Unlock Full Access</AppText>

                {/* Sub Trial Pill */}
                <View style={styles.trialPillRow}>
                  <View style={styles.trialPill}>
                    <AppIcon
                      name={'ShieldCheck'}
                      size={13}
                      color={COLORS.amberLightBg}
                    />
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
              <SubscriptionAddCardStep
                cardError={cardError}
                isSavingCard={isSavingCard}
                onCardChange={details => setCardDetails(details)}
                onSaveCardAndContinue={handleSaveCardAndContinue}
                onBack={() => setStep('plan_selection')}
              />
            ) : (
              <SubscriptionPlanSelectionStep
                shipperStatus={shipperStatus}
                selectedPlanType={selectedPlanType}
                setSelectedPlanType={setSelectedPlanType}
                plansData={plansData}
                currencySymbol={currencySymbol}
                planAmount={planAmount}
                intervalLabel={intervalLabel}
                trialDays={trialDays}
                isSubmitting={isSubmitting}
                onActionPress={handleActionPress}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default memo(SubscriptionRequiredModal);
