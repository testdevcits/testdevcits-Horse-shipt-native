import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import {
  Crown,
  CheckCircle,
  Calendar,
  FileText,
  CreditCard,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { formatDate } from '../../../../../utils/helpers';
import { AppText } from '../../../../../components';
import { COLORS, SPACING } from '../../../../../constants';
import shipperService from '../../../../../api/services/shipperService';
import styles from './styles.subscriptiontab';
import CancelSubscriptionModal from './CancelSubscriptionModal';

interface Props {
  subscriptionData: any;
  billingHistoryData: any;
  subscriptionStatusData?: any;
  billingFilter: 'All' | 'Invoices' | 'Payments' | 'Payouts';
  setBillingFilter: (filter: 'All' | 'Invoices' | 'Payments' | 'Payouts') => void;
  onOpenSubscriptionModal?: () => void;
}

const SubscriptionTab: React.FC<Props> = ({
  subscriptionData,
  billingHistoryData,
  subscriptionStatusData,
  billingFilter,
  setBillingFilter,
  onOpenSubscriptionModal,
}) => {
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelingSub, setCancelingSub] = useState(false);
  const [cancellationResult, setCancellationResult] = useState<{
    cancelAtPeriodEnd: boolean;
    accessValidTill?: string;
  } | null>(null);

  const subscriptionsList = useMemo(
    () => billingHistoryData?.subscriptions || [],
    [billingHistoryData],
  );
  const paymentsList = useMemo(
    () => billingHistoryData?.payments || [],
    [billingHistoryData],
  );
  const payoutsList = useMemo(
    () => billingHistoryData?.payouts || [],
    [billingHistoryData],
  );

  // Latest subscription/invoice item for header summary fallback
  const latestSub = subscriptionsList[0] || null;
  const isTrialInList = latestSub?.isTrialInvoice || latestSub?.displayType === 'trial';

  // Derived status values using GET /api/shipper/stripe/subscription/status
  const isSubActive = subscriptionStatusData
    ? !!(subscriptionStatusData.isActive || (subscriptionStatusData.hasAccess && !subscriptionStatusData.needsSubscription))
    : true;

  const isSubTrial = subscriptionStatusData
    ? !!(subscriptionStatusData.trialActive || subscriptionStatusData.isTrialing)
    : isTrialInList;

  const isCancelScheduled =
    cancellationResult?.cancelAtPeriodEnd ||
    !!subscriptionStatusData?.cancelAtPeriodEnd;

  const cancelValidTillDate =
    cancellationResult?.accessValidTill ||
    subscriptionStatusData?.currentPeriodEnd ||
    subscriptionStatusData?.trialEnd;

  const rawPlanType =
    subscriptionStatusData?.planType ||
    (isSubTrial ? 'trial' : subscriptionData?.monthly?.label || 'monthly');

  const planName =
    rawPlanType.toLowerCase() === 'trial' || isSubTrial
      ? 'Free Trial Plan'
      : `${rawPlanType.charAt(0).toUpperCase()}${rawPlanType.slice(1)} Plan`;

  const filteredList = useMemo(() => {
    let list: any[] = [];
    if (billingFilter === 'Invoices') list = subscriptionsList;
    else if (billingFilter === 'Payments') list = paymentsList;
    else if (billingFilter === 'Payouts') list = payoutsList;
    else {
      list = [...subscriptionsList, ...paymentsList, ...payoutsList];
    }

    // Sort by createdAt descending
    return list.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.paidAt || 0).getTime();
      const dateB = new Date(b.createdAt || b.paidAt || 0).getTime();
      return dateB - dateA;
    });
  }, [billingFilter, subscriptionsList, paymentsList, payoutsList]);

  const handleOpenUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };

  const handleCancelSubscription = async (reason: string) => {
    try {
      setCancelingSub(true);
      const res = await shipperService.cancelSubscription({ reason });
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Subscription Canceled',
          text2: res?.message || 'Subscription will be canceled at the end of billing cycle.',
        });
        setCancellationResult({
          cancelAtPeriodEnd: true,
          accessValidTill: res?.data?.accessValidTill,
        });
        setIsCancelModalVisible(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Cancellation Error',
          text2: res?.message || 'Unable to cancel subscription.',
        });
      }
    } catch (err: any) {
      console.error('Cancel Subscription Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          err?.response?.data?.message ||
          'Failed to cancel subscription.',
      });
    } finally {
      setCancelingSub(false);
    }
  };

  return (
    <View style={styles.tabSection}>
      <AppText style={styles.sectionHeaderTitle}>Billing & History</AppText>
      <AppText style={styles.sectionHeaderSub}>
        View your subscription, invoices, and transactions
      </AppText>

      {/* Subscription Status Card / Empty State matching Image 2 */}
      {!isSubActive ? (
        <View style={styles.emptySubCard}>
          <View style={styles.crownCircle}>
            <Crown size={26} color="#A06333" />
          </View>
          <AppText style={styles.emptySubTitle}>No active subscription</AppText>
          <AppText style={styles.emptySubSub}>Subscribe to unlock all features.</AppText>
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
      ) : (
        <View style={styles.subCardContainer}>
          <View style={styles.subCardHeader}>
            <View style={styles.goldSquareIconBox}>
              <Crown size={22} color="#A06333" />
            </View>

            <View style={styles.subHeaderTextCol}>
              <AppText style={styles.subHeaderTitle}>Subscription Status</AppText>
              <AppText style={styles.subHeaderSub}>
                Managed securely via Stripe Billing
              </AppText>
            </View>

            <View
              style={[
                styles.subActiveBadge,
                !isSubActive && { backgroundColor: COLORS.redLightBg, borderColor: COLORS.redBorder },
              ]}
            >
              <ShieldCheck size={14} color={isSubActive ? COLORS.emeraldPrimary : COLORS.redPrimary} />
              <AppText
                style={[
                  styles.subActiveBadgeText,
                  !isSubActive && { color: COLORS.redPrimary },
                ]}
              >
                {isSubActive ? 'Active' : 'Inactive'}
              </AppText>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Status Pills */}
          <View style={styles.statusPillsRow}>
            <View style={isSubTrial ? styles.blueOutlinePill : styles.greenOutlinePill}>
              <AppText
                style={
                  isSubTrial ? styles.blueOutlinePillText : styles.greenOutlinePillText
                }
              >
                {isSubTrial
                  ? `Free Trial Active (${subscriptionStatusData?.remainingTrialDays || 0}d left)`
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
              <Sparkles size={16} color="#A06333" />
              <AppText style={styles.planLabel}>CURRENT PLAN</AppText>
            </View>

            <View style={styles.planRow}>
              <View>
                <AppText style={styles.planName}>{planName}</AppText>
                {subscriptionStatusData?.currentPeriodStart &&
                  subscriptionStatusData?.currentPeriodEnd ? (
                  <AppText style={styles.planPeriodText}>
                    Cycle: {formatDate(subscriptionStatusData.currentPeriodStart, 'MMM DD, YYYY')} -{' '}
                    {formatDate(subscriptionStatusData.currentPeriodEnd, 'MMM DD, YYYY')}
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
                    : `$${latestSub?.amount ?? subscriptionData?.monthly?.amount ?? '19.99'} USD`}
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
              <AlertCircle size={18} color="#D97706" />
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
                <CheckCircle size={18} color={COLORS.emeraldPrimary} />
                <AppText style={styles.subActiveBannerText}>
                  Subscription Active
                </AppText>
              </View>

              <TouchableOpacity
                style={styles.cancelSubTriggerBtn}
                onPress={() => setIsCancelModalVisible(true)}
                activeOpacity={0.7}
              >
                <AppText style={styles.cancelSubTriggerBtnText}>
                  Cancel Subscription
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Billing History Section */}
      <View style={{ marginTop: SPACING.lg }}>
        <View style={styles.subCardHeader}>
          <View style={styles.goldSquareIconBox}>
            <Calendar size={22} color={COLORS.brandBrown} />
          </View>

          <View style={styles.subHeaderTextCol}>
            <AppText style={styles.subHeaderTitle}>Billing History</AppText>
            <AppText style={styles.subHeaderSub}>
              Invoices, receipts, and payment transactions
            </AppText>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* Filter Pills */}
        <View style={styles.billingFilterRow}>
          {(
            [
              {
                label: 'All',
                count:
                  subscriptionsList.length +
                  paymentsList.length +
                  payoutsList.length,
              },
              { label: 'Invoices', count: subscriptionsList.length },
              { label: 'Payments', count: paymentsList.length },
              { label: 'Payouts', count: payoutsList.length },
            ] as const
          ).map(f => (
            <TouchableOpacity
              key={f.label}
              style={[
                styles.billingFilterPill,
                billingFilter === f.label && styles.billingFilterPillActive,
              ]}
              onPress={() =>
                setBillingFilter(
                  f.label as 'All' | 'Invoices' | 'Payments' | 'Payouts',
                )
              }
            >
              <AppText
                style={[
                  styles.billingFilterText,
                  billingFilter === f.label && styles.billingFilterTextActive,
                ]}
              >
                {f.label} ({f.count})
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions List */}
        <View style={styles.historyListContainer}>
          {filteredList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FileText size={32} color={COLORS.textLight} />
              <AppText style={styles.emptyTitle}>No records found</AppText>
              <AppText style={styles.emptySub}>
                No {billingFilter.toLowerCase()} available for this account.
              </AppText>
            </View>
          ) : (
            filteredList.map((item, idx) => {
              const isInvoice =
                !!item.invoicePdf ||
                !!item.hostedInvoiceUrl ||
                item.displayType === 'invoice' ||
                item.displayType === 'trial';
              const isPayment =
                !!item.receiptUrl || item.paymentMethod === 'card';

              const targetUrl =
                item.invoicePdf || item.hostedInvoiceUrl || item.receiptUrl;

              const dateStr = formatDate(
                item.createdAt ||
                item.paidAt ||
                item.periodStart ||
                new Date(),
                'MMM DD, YYYY • hh:mm A',
              );

              const titleText =
                item.title ||
                item.description ||
                (isInvoice
                  ? 'Subscription Invoice'
                  : isPayment
                    ? 'Card Payment Receipt'
                    : 'Payout Transfer');

              const statusStr = (item.status || 'paid').toLowerCase();
              const isSuccessStatus =
                statusStr === 'paid' || statusStr === 'succeeded';

              return (
                <View
                  key={item.id || item._id || idx}
                  style={[
                    styles.historyCardItem,
                    idx === filteredList.length - 1 &&
                    { borderBottomWidth: 0 },
                  ]}
                >
                  {/* Left Type Icon */}
                  <View style={styles.itemIconBox}>
                    {isInvoice ? (
                      <FileText size={18} color={COLORS.brandBrown} />
                    ) : isPayment ? (
                      <CreditCard size={18} color={COLORS.bluePrimary} />
                    ) : (
                      <ArrowUpRight size={18} color={COLORS.emeraldPrimary} />
                    )}
                  </View>

                  {/* Content Details */}
                  <View style={styles.itemContentCol}>
                    <View style={styles.itemTopRow}>
                      <AppText style={styles.itemTitleText} numberOfLines={1}>
                        {titleText}
                      </AppText>
                      <AppText style={styles.itemAmountText}>
                        {item.isNoChargeInvoice || item.amount === 0
                          ? 'Free'
                          : `$${Number(item.amount).toFixed(2)} ${(
                            item.currency || 'USD'
                          ).toUpperCase()}`}
                      </AppText>
                    </View>

                    <View style={styles.itemBottomRow}>
                      <AppText style={styles.itemDateText}>{dateStr}</AppText>

                      {item.cardBrand && item.last4 ? (
                        <AppText style={styles.itemCardText}>
                          • {item.cardBrand.toUpperCase()} •••• {item.last4}
                        </AppText>
                      ) : null}
                    </View>

                    {/* Status & PDF Link Row */}
                    <View style={styles.itemBadgeRow}>
                      <View
                        style={[
                          styles.statusBadgePill,
                          isSuccessStatus
                            ? styles.statusBadgeSuccess
                            : styles.statusBadgeTrial,
                        ]}
                      >
                        <AppText
                          style={[
                            styles.statusBadgeText,
                            isSuccessStatus
                              ? styles.statusBadgeTextSuccess
                              : styles.statusBadgeTextTrial,
                          ]}
                        >
                          {item.isTrialInvoice
                            ? 'Trial Invoice'
                            : (item.status || 'paid').toUpperCase()}
                        </AppText>
                      </View>

                      {targetUrl ? (
                        <TouchableOpacity
                          style={styles.viewPdfBtn}
                          onPress={() => handleOpenUrl(targetUrl)}
                          activeOpacity={0.7}
                        >
                          <ExternalLink size={12} color="#A06333" />
                          <AppText style={styles.viewPdfBtnText}>
                            {isInvoice ? 'View PDF' : 'Receipt'}
                          </AppText>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal
        visible={isCancelModalVisible}
        onClose={() => setIsCancelModalVisible(false)}
        onConfirmCancel={handleCancelSubscription}
        planName={planName}
        submitting={cancelingSub}
      />
    </View>
  );
};

export default SubscriptionTab;
