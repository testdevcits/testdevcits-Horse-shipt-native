import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import PaymentsTab from '../profile/tabs/payments/PaymentsTab';
import styles from '../profile/shipper_profile/styles.shipperprofile';

const ShipperPaymentsScreen = ({ navigation }: any) => {
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStripeStatus = useCallback(async () => {
    try {
      const res = await shipperService.getStripeStatus();
      if (res) {
        setStripeStatus(res);
      }
    } catch (err) {
      console.error('Fetch Stripe Status Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStripeStatus();
  }, [fetchStripeStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStripeStatus();
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Payment Settings" showProfileImage={false} />

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
            Loading payout details...
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
          <PaymentsTab
            stripeStatus={stripeStatus}
            navigation={navigation}
            onRefreshStripeStatus={fetchStripeStatus}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default ShipperPaymentsScreen;
