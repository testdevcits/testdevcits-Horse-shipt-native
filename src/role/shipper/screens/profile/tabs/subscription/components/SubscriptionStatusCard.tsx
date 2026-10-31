import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../../../components';
import AppIcon from '../../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../../constants';
import { formatDate } from '../../../../../../../utils/helpers';
import styles from '../styles.subscriptiontab';

interface SubscriptionStatusCardProps {
  isSubActive: boolean;
  isSubTrial: boolean;
  planName: string;
  subscriptionStatusData?: any;
  latestSub?: any;
  subscriptionData?: any;
  isCancelScheduled: boolean;
  cancelValidTillDate?: string;
  onOpenSubscriptionModal?: () => void;
  onOpenCancelModal: () => void;
}

export const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  isSubActive,
  isSubTrial,
  planName,
  subscriptionStatusData,
  latestSub,
  subscriptionData,
  isCancelScheduled,
  cancelValidTillDate,
  onOpenSubscriptionModal,
  onOpenCancelModal,
}) => {
  if (!isSubActive) {
    return (
      <View style={styles.emptySubCard}>
        <View style={styles.crownCircle}>
          <AppIcon name="Crown" size={26} color={COLORS.saddleBrown} />
        </View>
        <AppText style={styles.emptySubTitle}>No active subscription</AppText>
        <AppText style={styles.emptySubSub}>
          Subscribe to unlock all features.
        </AppText>
        {onOpenSubscriptionModal && (
          <TouchableOpacity
            style={styles.subscribeNowBtn}
            onPress={onOpenSubscriptionModal}
            activeOpacity={0.85}
          >
            <AppText style={styles.subscribeNowBtnText}>Subscribe Now</AppText>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.subCardContainer}>
      <View style={styles.subCardHeader}>
        <View style={styles.goldSquareIconBox}>
          <AppIcon name="Crown" size={22} color={COLORS.saddleBrown} />
        </View>

        <View style={styles.subHeaderTextCol}>
          <AppText style={styles.subHeaderTitle}>Subscription Status</AppText>
          <AppText style={styles.subHeaderSub}>
            Managed securely via Stripe Billing
          </AppText>
        </View>

        <View style={styles.subActiveBadge}>
          <AppIcon name="ShieldCheck" size={14} color={COLORS.emeraldPrimary} />
          <AppText style={styles.subActiveBadgeText}>Active</AppText>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* Status Pills */}
      <View style={styles.statusPillsRow}>
        <View
          style={isSubTrial ? styles.blueOutlinePill : styles.greenOutlinePill}
        >
          <AppText
            style={
              isSubTrial
                ? styles.blueOutlinePillText
                : styles.greenOutlinePillText
            }
          >
            {isSubTrial
              ? `Free Trial Active (${
                  subscriptionStatusData?.remainingTrialDays || 0
                }d left)`
              : 'Paid Subscription'}
          </AppText>
        </View>

        <View style={styles.goldOutlinePill}>
          <AppText style={styles.goldOutlinePillText}>{planName}</AppText>
        </View>
      </View>

      {/* Plan Card Box */}
      <View style={styles.planDetailsBox}>
        <View style={styles.planDetailsHeader}>
          <AppIcon name="Sparkles" size={16} color={COLORS.saddleBrown} />
          <AppText style={styles.planLabel}>CURRENT PLAN</AppText>
        </View>

        <View style={styles.planRow}>
          <View>
            <AppText style={styles.planName}>{planName}</AppText>
            {subscriptionStatusData?.currentPeriodStart &&
            subscriptionStatusData?.currentPeriodEnd ? (
              <AppText style={styles.planPeriodText}>
                Cycle:{' '}
                {formatDate(
                  subscriptionStatusData.currentPeriodStart,
                  'MMM DD, YYYY',
                )}{' '}
                -{' '}
                {formatDate(
                  subscriptionStatusData.currentPeriodEnd,
                  'MMM DD, YYYY',
                )}
              </AppText>
            ) : latestSub?.periodStart && latestSub?.periodEnd ? (
              <AppText style={styles.planPeriodText}>
                Cycle: {formatDate(latestSub.periodStart, 'MMM DD, YYYY')} -{' '}
                {formatDate(latestSub.periodEnd, 'MMM DD, YYYY')}
              </AppText>
            ) : null}
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <AppText style={styles.planPrice}>
              {isSubTrial
                ? '$0.00 USD'
                : `$${
                    latestSub?.amount ??
                    subscriptionData?.monthly?.amount ??
                    '00.00'
                  } USD`}
            </AppText>
            <AppText style={styles.planBillingFrequency}>
              {isSubTrial ? 'Trial Period' : '/ billing cycle'}
            </AppText>
          </View>
        </View>
      </View>

      {/* Active Banner & Cancel Button Row */}
      {isCancelScheduled ? (
        <View style={styles.subCancelingBanner}>
          <AppIcon name="AlertCircle" size={18} color={COLORS.amberPrimary} />
          <AppText style={styles.subCancelingBannerText}>
            Subscription scheduled to cancel on{' '}
            {cancelValidTillDate
              ? formatDate(cancelValidTillDate, 'MMM DD, YYYY')
              : 'end of billing cycle'}
          </AppText>
        </View>
      ) : (
        <View style={styles.subActiveBannerRow}>
          <View style={styles.subActiveBanner}>
            <AppIcon
              name="CheckCircle"
              size={18}
              color={COLORS.emeraldPrimary}
            />
            <AppText style={styles.subActiveBannerText}>
              Subscription Active
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.cancelSubTriggerBtn}
            onPress={onOpenCancelModal}
            activeOpacity={0.7}
          >
            <AppText style={styles.cancelSubTriggerBtnText}>
              Cancel Subscription
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
