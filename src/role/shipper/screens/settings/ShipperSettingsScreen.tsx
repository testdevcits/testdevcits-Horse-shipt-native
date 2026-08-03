import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Bell, Check } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AppHeader, AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.shippersettings';

const NOTIFICATION_ITEMS = [
  {
    key: 'quote',
    title: 'Quote won',
    desc: 'Get notified when you win a quote?.',
  },
  {
    key: 'opportunity',
    title: 'New Opportunity',
    desc: 'When a new opportunity in your area is published.',
  },
  {
    key: 'message',
    title: 'New message',
    desc: 'When you receive a new message from a carrier or shipper.',
  },
  {
    key: 'question',
    title: 'Shipment questions',
    desc: 'When a customer answers your shipment question.',
  },
  {
    key: 'review',
    title: 'Review received',
    desc: 'When a customer leaves a review.',
  },
  {
    key: 'shipment',
    title: 'Upcoming shipment',
    desc: 'Reminders before a scheduled shipment departure.',
  },
];

const ShipperSettingsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [notifications, setNotifications] = useState<any>({
    quote: { email: true, sms: true },
    opportunity: { email: true, sms: true },
    message: { email: true, sms: true },
    question: { email: true, sms: true },
    review: { email: true, sms: true },
    shipment: { email: true, sms: true },
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await shipperService.getSettings();
      if (res?.data?.notifications) {
        setNotifications(res.data?.notifications);
      }
    } catch (error: any) {
      console.error('Fetch Shipper Settings Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSettings();
  };

  const handleToggleNotification = async (key: string, channel: 'email' | 'sms') => {
    const currentVal = notifications[key]?.[channel] ?? true;
    const updated = {
      ...notifications,
      [key]: {
        ...notifications[key],
        [channel]: !currentVal,
      },
    };

    setNotifications(updated);

    try {
      const res = await shipperService.updateNotifications(updated);
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Settings Updated',
          text2: 'Notification preferences saved successfully.',
        });
      }
    } catch (error: any) {
      console.error('Update Notifications Error:', error);
      // Revert on error
      setNotifications(notifications);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.response?.data?.message || 'Failed to update notification settings.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        <AppText style={styles.sectionHeaderTitle}>Notifications</AppText>
        <AppText style={styles.sectionHeaderSub}>
          Choose how and when you receive updates about your shipments and activity.
        </AppText>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.goldPrimary} />
          </View>
        ) : (
          <>
            {/* Shipment Notifications Card */}
            <View style={styles.notificationsCard}>
              <View style={styles.subCardHeader}>
                <View style={styles.goldSquareIconBox}>
                  <Bell size={22} color="#A06333" />
                </View>

                <View style={styles.subHeaderTextCol}>
                  <AppText style={styles.subHeaderTitle}>Shipment Notifications</AppText>
                  <AppText style={styles.subHeaderSub}>
                    Configure email & SMS alerts for carrier activity
                  </AppText>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Column Headers */}
              <View style={styles.notifColHeadersRow}>
                <AppText style={styles.notifChannelText}>Email</AppText>
                <AppText style={styles.notifChannelText}>SMS</AppText>
              </View>

              {/* Notification Rows */}
              {NOTIFICATION_ITEMS.map((item, idx) => {
                const isEmailChecked = notifications[item?.key]?.email;
                const isSmsChecked = notifications[item?.key]?.sms;
                const isLast = idx === NOTIFICATION_ITEMS.length - 1;

                return (
                  <View
                    key={item?.key}
                    style={[styles.notifItemRow, isLast && { borderBottomWidth: 0 }]}
                  >
                    <View style={styles.notifTextCol}>
                      <AppText style={styles.notifItemTitle}>{item?.title}</AppText>
                      <AppText style={styles.notifItemDesc}>{item?.desc}</AppText>
                    </View>

                    <View style={styles.notifCheckboxesCol}>
                      {/* Email Checkbox */}
                      <TouchableOpacity
                        style={[
                          styles.notifCheckbox,
                          isEmailChecked && styles.notifCheckboxActive,
                        ]}
                        onPress={() => handleToggleNotification(item?.key, 'email')}
                        activeOpacity={0.8}
                      >
                        {isEmailChecked && <Check size={14} color="#A06333" />}
                      </TouchableOpacity>

                      {/* SMS Checkbox */}
                      <TouchableOpacity
                        style={[
                          styles.notifCheckbox,
                          isSmsChecked && styles.notifCheckboxActive,
                        ]}
                        onPress={() => handleToggleNotification(item?.key, 'sms')}
                        activeOpacity={0.8}
                      >
                        {isSmsChecked && <Check size={14} color="#A06333" />}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Bottom Callout Banner */}
            <View style={styles.calloutBanner}>
              <AppText style={styles.calloutText}>
                SMS notifications may incur carrier charges depending on your plan.
              </AppText>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ShipperSettingsScreen;
