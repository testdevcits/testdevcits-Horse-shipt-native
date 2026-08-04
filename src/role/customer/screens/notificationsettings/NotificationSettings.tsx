import React from 'react';
import { View, ScrollView, Switch, ActivityIndicator, Platform } from 'react-native';
import styles from './NotificationSettings.styles';
import { useNotificationSettings } from './useNotificationSettings';
import { COLORS } from '../../../../constants';
import { AppText } from '../../../../components';

const NotificationSettings = () => {
  const { settings, loading, toggleSetting } = useNotificationSettings();

  const renderSettingItem = (key: string, title: string) => (
    <View style={styles.settingItem}>
      <AppText style={styles.itemTitle}>{title}</AppText>
      <Switch
        value={settings[key as keyof typeof settings]}
        onValueChange={() => toggleSetting(key)}
        trackColor={{
          false: COLORS.grey200,
          true: COLORS.primary // Using your A37F3D color
        }}
        thumbColor={COLORS.white}
        ios_backgroundColor={COLORS.grey200}
      />
    </View>
  );

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <AppText style={styles.title}>Notifications</AppText>
        <AppText style={styles.subtitle}>
          Notifications are customizable alerts that keep you updated about specific
          activities in HorseShipt, they ensure you never miss anything while you're away.
        </AppText>
      </View>

      <View style={styles.settingsBox}>
        {renderSettingItem('newQuote', 'When I receive a new quote')}
        {renderSettingItem('offerInteraction', 'When someone interacts with my offer')}
        {renderSettingItem('newMessage', 'When I receive a new message')}
        {renderSettingItem('newReview', 'When I receive a review')}
        {renderSettingItem('question', 'When someone asks a shipment question')}
        {renderSettingItem('upcomingShipment', 'When I have an upcoming shipment')}
        {renderSettingItem('shipmentUpdates', 'Receive real time updates about current shipments')}
      </View>

      <View style={styles.footer}>
        <AppText style={styles.footerText}>Changes are saved automatically</AppText>
      </View>
    </ScrollView>
  );
};

export default NotificationSettings;