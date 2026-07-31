import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Bell, Check } from 'lucide-react-native';
import { AppText } from '../../../../../components';
import styles from './styles.notificationtab';

interface Props {
  notifications: any;
  handleToggleNotification: (key: string, channel: 'email' | 'sms') => void;
}

const NotificationTab: React.FC<Props> = ({
  notifications,
  handleToggleNotification,
}) => {
  const notifItems = [
    {
      key: 'quote',
      title: 'Quote won',
      desc: 'Get notified when you win a quote.',
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
      desc: 'When a customer answers your shipment question.',
    },
    {
      key: 'shipment',
      title: 'Upcoming shipment',
      desc: 'Reminders before a scheduled shipment departure.',
    },
  ];

  return (
    <View style={styles.tabSection}>
      <AppText style={styles.sectionHeaderTitle}>Notifications</AppText>
      <AppText style={styles.sectionHeaderSub}>
        Choose how and when you receive updates about your shipments and activity.
      </AppText>

      {/* Shipment Notifications Card */}
      <View style={styles.notificationsCard}>
        <View style={styles.subCardHeader}>
          <View style={styles.goldSquareIconBox}>
            <Bell size={22} color="#A06333" />
          </View>

          <View style={styles.subHeaderTextCol}>
            <AppText style={styles.subHeaderTitle}>Shipment Notifications</AppText>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* Column Headers */}
        <View style={styles.notifColHeadersRow}>
          <AppText style={styles.notifChannelText}>Email</AppText>
          <AppText style={styles.notifChannelText}>SMS</AppText>
        </View>

        {/* Checkbox Rows */}
        {notifItems.map(item => {
          const isEmailChecked = notifications[item.key]?.email;
          const isSmsChecked = notifications[item.key]?.sms;

          return (
            <View key={item.key} style={styles.notifItemRow}>
              <View style={styles.notifTextCol}>
                <AppText style={styles.notifItemTitle}>{item.title}</AppText>
                <AppText style={styles.notifItemDesc}>{item.desc}</AppText>
              </View>

              <View style={styles.notifCheckboxesCol}>
                {/* Email Checkbox */}
                <TouchableOpacity
                  style={[
                    styles.notifCheckbox,
                    isEmailChecked && styles.notifCheckboxActive,
                  ]}
                  onPress={() => handleToggleNotification(item.key, 'email')}
                >
                  {isEmailChecked && <Check size={14} color="#A06333" />}
                </TouchableOpacity>

                {/* SMS Checkbox */}
                <TouchableOpacity
                  style={[
                    styles.notifCheckbox,
                    isSmsChecked && styles.notifCheckboxActive,
                  ]}
                  onPress={() => handleToggleNotification(item.key, 'sms')}
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
    </View>
  );
};

export default NotificationTab;
