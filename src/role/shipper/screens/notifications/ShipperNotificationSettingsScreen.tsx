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
import NotificationTab from '../profile/tabs/notifications/NotificationTab';
import styles from '../profile/shipper_profile/styles.shipperprofile';

const ShipperNotificationSettingsScreen = () => {
  const [notifications, setNotifications] = useState<any>({
    quote: { email: true, sms: true },
    opportunity: { email: true, sms: true },
    message: { email: true, sms: true },
    question: { email: true, sms: true },
    review: { email: true, sms: true },
    shipment: { email: true, sms: true },
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationSettings = useCallback(async () => {
    try {
      const setRes = await shipperService.getSettings().catch(() => null);
      if (setRes?.data?.notifications) {
        setNotifications(setRes.data.notifications);
      }
    } catch (err) {
      console.error('Fetch Notifications Settings Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationSettings();
  }, [fetchNotificationSettings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotificationSettings();
  };

  const handleToggleNotification = async (
    key: string,
    channel: 'email' | 'sms',
  ) => {
    const updated = {
      ...notifications,
      [key]: {
        ...notifications[key],
        [channel]: !notifications[key]?.[channel],
      },
    };
    setNotifications(updated);

    try {
      await shipperService.updateNotifications(updated);
    } catch (e) {
      console.error('Update Notifications Error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Notification Preferences" showProfileImage={false} />

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
            Loading preferences...
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
          <NotificationTab
            notifications={notifications}
            handleToggleNotification={handleToggleNotification}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default ShipperNotificationSettingsScreen;
