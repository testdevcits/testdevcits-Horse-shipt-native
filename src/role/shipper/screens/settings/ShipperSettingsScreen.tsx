import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardSub: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default ShipperSettingsScreen;
