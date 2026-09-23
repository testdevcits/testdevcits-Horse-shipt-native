import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import SubscriptionTab from '../profile/tabs/subscription/SubscriptionTab';
import useShipperSubscription from '../../../../hooks/useShipperSubscription';
import styles from '../profile/shipper_profile/styles.shipperprofile';

const SubscriptionRequiredModal = lazy(
  () =>
    import(
      '../../components/subscription_required_modal/SubscriptionRequiredModal'
    ),
);

const ShipperSubscriptionScreen = () => {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [billingHistoryData, setBillingHistoryData] = useState<any>(null);
  const [subscriptionStatusData, setSubscriptionStatusData] =
    useState<any>(null);
  const [billingFilter, setBillingFilter] = useState<
    'All' | 'Invoices' | 'Payments' | 'Payouts'
  >('All');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {
    shipperStatus,
    subscriptionStatus,
    plansData,
    isModalVisible: isSubModalVisible,
    openModal: openSubModal,
    closeModal: closeSubModal,
    refreshStatus: refreshSubStatus,
  } = useShipperSubscription();

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      const [subRes, billRes, subStatusRes] = await Promise.all([
        shipperService.getSubscriptionPlan().catch(() => null),
        shipperService.getBillingHistory().catch(() => null),
        shipperService.getSubscriptionStatus().catch(() => null),
      ]);

      if (subRes?.data) {
        setSubscriptionData(subRes.data);
      }
      if (billRes) {
        setBillingHistoryData(billRes.data || billRes);
      }
      if (subStatusRes) {
        setSubscriptionStatusData(subStatusRes);
      }
    } catch (err) {
      console.error('Fetch Subscription Details Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [fetchSubscriptionDetails]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubscriptionDetails();
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Subscription & Billing"
        showBack={true}
        showProfileImage={false}
      />

      {loading && !refreshing ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <AppText
            style={{
              marginTop: 12,
              fontFamily: FONTS.medium,
              color: COLORS.textSecondary,
            }}
          >
            Loading subscription details...
          </AppText>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          <SubscriptionTab
            subscriptionData={subscriptionData}
            billingHistoryData={billingHistoryData}
            subscriptionStatusData={subscriptionStatusData}
            billingFilter={billingFilter}
            setBillingFilter={setBillingFilter}
            onOpenSubscriptionModal={openSubModal}
            subsciptionPlans={subscriptionData?.plans || []}
          />
        </ScrollView>
      )}

      <Suspense fallback={null}>
        <SubscriptionRequiredModal
          visible={isSubModalVisible}
          onClose={closeSubModal}
          shipperStatus={shipperStatus}
          subscriptionStatus={subscriptionStatus}
          plansData={plansData}
          onSubscriptionSuccess={() => {
            refreshSubStatus();
            fetchSubscriptionDetails();
          }}
        />
      </Suspense>
    </View>
  );
};

export default ShipperSubscriptionScreen;
