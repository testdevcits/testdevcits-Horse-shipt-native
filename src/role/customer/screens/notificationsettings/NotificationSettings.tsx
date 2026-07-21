import React from 'react';
import { View, ScrollView, Switch, ActivityIndicator, Platform } from 'react-native';
import { 
  Quote, Tag, MessageSquare, HelpCircle, 
  Star, Calendar, Truck, Bell, Mail, Smartphone 
} from 'lucide-react-native';

import styles from './NotificationSettings.styles';
import { useNotificationSettings } from './useNotificationSettings';
import { COLORS } from '../../../../constants';
import { AppText } from '../../../../components';
 
const NotificationSettings = () => {
  const { settings, loading, toggleSetting } = useNotificationSettings();

  const renderSettingItem = (
    key: string, 
    title: string, 
    desc: string, 
    Icon: any
  ) => (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Icon size={20} color={COLORS.goldPrimary} strokeWidth={2.2} />
      </View>
      <View style={styles.textContainer}>
        <AppText style={styles.itemTitle}>{title}</AppText>
        <AppText style={styles.itemDesc}>{desc}</AppText>
      </View>
      <Switch
        value={settings[key as keyof typeof settings]}
        onValueChange={() => toggleSetting(key)}
        trackColor={{ false: COLORS.grey200, true: COLORS.goldPrimary }}
        thumbColor={Platform.OS === 'ios' ? undefined : COLORS.white}
        ios_backgroundColor={COLORS.grey200}
      />
    </View>
  );

  if (loading) return <View style={styles.container}><ActivityIndicator color={COLORS.goldPrimary} size="large" style={{flex: 1}}/></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Notifications</AppText>
        <AppText style={styles.subtitle}>Manage how you want to be notified</AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Activity Section */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>Activity & Quotes</AppText>
        </View>

        {renderSettingItem(
          'newQuote', 
          'New Quote Received', 
          'Get notified when a transporter sends you a new quote', 
          Quote
        )}
        
        {renderSettingItem(
          'offerInteraction', 
          'Offer Interaction', 
          'Get notified when someone interacts with your offer', 
          Tag
        )}

        {renderSettingItem(
          'newMessage', 
          'New Message', 
          'Get notified when you receive a new chat message', 
          MessageSquare
        )}

        {/* Shipment Tracking Section */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>Shipment Tracking</AppText>
        </View>

        {renderSettingItem(
          'shipmentUpdates', 
          'Real-time Updates', 
          'Receive live updates about your current shipments status', 
          Truck
        )}

        {renderSettingItem(
          'upcomingShipment', 
          'Upcoming Shipment', 
          'Get reminded about your upcoming scheduled shipments', 
          Calendar
        )}

        {/* Feedback Section */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>Feedback & Help</AppText>
        </View>

        {renderSettingItem(
          'question', 
          'Shipment Questions', 
          'Get notified when a shipper asks a shipment question', 
          HelpCircle
        )}

        {renderSettingItem(
          'newReview', 
          'New Review', 
          'Get notified when someone leaves you a profile review', 
          Star
        )}

        <View style={styles.footer}>
          <AppText style={styles.footerText}>Changes are saved automatically</AppText>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationSettings;