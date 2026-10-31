import React, { memo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import {
  ShipperStatus,
  SubscriptionPlansData,
} from '../../../../../hooks/useShipperSubscription';
import styles from '../styles.subscriptionRequiredModal';

interface SubscriptionPlanSelectionStepProps {
  shipperStatus: ShipperStatus;
  selectedPlanType: 'daily' | 'monthly' | 'yearly';
  setSelectedPlanType: (type: 'daily' | 'monthly' | 'yearly') => void;
  plansData: SubscriptionPlansData | null;
  currencySymbol: string;
  planAmount: number;
  intervalLabel: string;
  trialDays: number;
  isSubmitting: boolean;
  onActionPress: () => void;
}

const SubscriptionPlanSelectionStep: React.FC<
  SubscriptionPlanSelectionStepProps
> = ({
  shipperStatus,
  selectedPlanType,
  setSelectedPlanType,
  plansData,
  currencySymbol,
  planAmount,
  intervalLabel,
  trialDays,
  isSubmitting,
  onActionPress,
}) => {
  return (
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
                <AppIcon
                  name={'CheckCircle2'}
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
              selectedPlanType === 'daily' && styles.planTabTextActive,
            ]}
          >
            ONE DAY
          </AppText>
          <AppText
            style={[
              styles.planTabPrice,
              selectedPlanType === 'daily' && styles.planTabTextActive,
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
            selectedPlanType === 'monthly' && styles.planTabCardActive,
          ]}
          onPress={() => setSelectedPlanType('monthly')}
          activeOpacity={0.85}
        >
          <AppText
            style={[
              styles.planTabName,
              selectedPlanType === 'monthly' && styles.planTabTextActive,
            ]}
          >
            MONTHLY
          </AppText>
          <AppText
            style={[
              styles.planTabPrice,
              selectedPlanType === 'monthly' && styles.planTabTextActive,
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
              selectedPlanType === 'yearly' && styles.planTabTextActive,
            ]}
          >
            YEARLY
          </AppText>
          <AppText
            style={[
              styles.planTabPrice,
              selectedPlanType === 'yearly' && styles.planTabTextActive,
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
            <AppIcon
              name={'AlertCircle'}
              size={18}
              color={COLORS.amberWarning}
            />
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
        onPress={onActionPress}
        disabled={isSubmitting}
        activeOpacity={0.88}
      >
        {isSubmitting ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <View style={styles.actionBtnContent}>
            {!shipperStatus.hasCard && (
              <AppIcon name={'CreditCard'} size={18} color={COLORS.white} />
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
  );
};

export default memo(SubscriptionPlanSelectionStep);
