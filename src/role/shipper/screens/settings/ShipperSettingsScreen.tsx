import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader, AppText } from '../../../../components';
import styles from './styles.shippersettings';

const ShipperSettingsScreen = () => {
  return (
    <View style={styles.container}>
      <AppHeader title="Settings" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Account & App Settings</AppText>
          <AppText style={styles.cardSub}>
            Manage notifications, privacy settings, and carrier account preferences.
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShipperSettingsScreen;
