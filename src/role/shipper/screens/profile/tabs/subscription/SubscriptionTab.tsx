import React, { useState, useMemo } from 'react';
import { View } from 'react-native';

import { AppText } from '../../../../../../components';
import shipperService from '../../../../../../api/services/shipperService';
import styles from './styles.subscriptiontab';
import CancelSubscriptionModal from '../cancel_subscription/CancelSubscriptionModal';
import { SubscriptionStatusCard } from './components/SubscriptionStatusCard';
import { BillingHistorySection } from './components/BillingHistorySection';
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../utils/toast';

interface Props {
  subscriptionData: any;
  billingHistoryData: any;
  subscriptionStatusData?: any;
  billingFilter: 'All' | 'Invoices' | 'Payments' | 'Payouts';
  setBillingFilter: (
    filter: 'All' | 'Invoices' | 'Payments' | 'Payouts',
  ) => void;
  onOpenSubscriptionModal?: () => void;
  subsciptionPlans?: any;
}

const SubscriptionTab: React.FC<Props> = ({
  subscriptionData,
  billingHistoryData,
  subscriptionStatusData,
  billingFilter,
  setBillingFilter,
  onOpenSubscriptionModal,
  subsciptionPlans,
}) => {
  console.log('subsciptionPlans Data:', subsciptionPlans);

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
  const isTrialInList =
    latestSub?.isTrialInvoice || latestSub?.displayType === 'trial';

  // Derived status values using GET /api/shipper/stripe/subscription/status
  const isSubActive = subscriptionStatusData
    ? !!(
      subscriptionStatusData.isActive ||
      (subscriptionStatusData.hasAccess &&
        !subscriptionStatusData.needsSubscription)
    )
    : true;

  const isSubTrial = subscriptionStatusData
    ? !!(
      subscriptionStatusData.trialActive || subscriptionStatusData.isTrialing
    )
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

  const handleCancelSubscription = async (reason: string) => {
    try {
      setCancelingSub(true);
      const res = await shipperService.cancelSubscription({ reason });
      if (res?.success) {
        showSuccessToast(
          'Subscription Canceled',
          res?.message ||
          'Subscription will be canceled at the end of billing cycle.',
        );
        setCancellationResult({
          cancelAtPeriodEnd: true,
          accessValidTill: res?.data?.accessValidTill,
        });
        setIsCancelModalVisible(false);
      } else {
        showErrorToast(
          'Cancellation Error',
          res?.message || 'Unable to cancel subscription.',
        );
      }
    } catch (err: any) {
      console.error('Cancel Subscription Error:', err);
      showErrorToast(
        'Error',
        err?.response?.data?.message || 'Failed to cancel subscription.',
      );
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

      {/* Subscription Status Card */}
      <SubscriptionStatusCard
        isSubActive={isSubActive}
        isSubTrial={isSubTrial}
        planName={planName}
        subscriptionStatusData={subscriptionStatusData}
        latestSub={latestSub}
        subscriptionData={subscriptionData}
        isCancelScheduled={isCancelScheduled}
        cancelValidTillDate={cancelValidTillDate}
        onOpenSubscriptionModal={onOpenSubscriptionModal}
        onOpenCancelModal={() => setIsCancelModalVisible(true)}
      />

      {/* Billing History Section */}
      <BillingHistorySection
        billingFilter={billingFilter}
        setBillingFilter={setBillingFilter}
        subscriptionsList={subscriptionsList}
        paymentsList={paymentsList}
        payoutsList={payoutsList}
        filteredList={filteredList}
      />

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
