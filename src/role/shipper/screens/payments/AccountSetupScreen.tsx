import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Lock, ArrowLeft, RefreshCw, X } from 'lucide-react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '../../../../constants';
import Toast from 'react-native-toast-message';

const AccountSetupScreen: React.FC<any> = ({ route, navigation }) => {
  const { url, title = 'Account Setup' } = route?.params || {};
  const [loading, setLoading] = useState(true);
  const [webUrl, setWebUrl] = useState<string>(url || '');

  const handleNavigationStateChange = (navState: any) => {
    // Detect Stripe Onboarding return URLs (e.g., success, return, or complete)
    if (navState.url) {
      const lowerUrl = navState.url.toLowerCase();
      if (
        lowerUrl.includes('return') ||
        lowerUrl.includes('success') ||
        lowerUrl.includes('complete')
      ) {
        Toast.show({
          type: 'success',
          text1: 'Onboarding Submitted',
          text2: 'Your Stripe payout account details have been updated.',
        });
        navigation.goBack();
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* APP HEADER WITH GO BACK */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={COLORS.textPrimary || '#0F172A'} />
        </TouchableOpacity>

        <AppText style={styles.headerTitle}>{title}</AppText>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={20} color={COLORS.textSecondary || '#64748B'} />
        </TouchableOpacity>
      </View>

      {/* SECURE SUB-HEADER BANNER */}
      <View style={styles.securityBanner}>
        <Lock size={13} color="#A06333" />
        <AppText style={styles.securityBannerText}>
          Secured Connection • Stripe Encrypted Payout Verification
        </AppText>
      </View>

      {/* WEBVIEW CONTAINER */}
      <View style={styles.webviewContainer}>
        {webUrl ? (
          <WebView
            source={{ uri: webUrl }}
            style={styles.webview}
            startInLoadingState={true}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            renderLoading={() => (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#A06333" />
                <AppText style={styles.loaderText}>Loading Stripe Verification...</AppText>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>Invalid or missing onboarding URL.</AppText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.md + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#0F172A',
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6F0',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  securityBannerText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.medium,
    color: '#8C5226',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  webview: {
    flex: 1,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  loaderText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary || '#64748B',
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
  },
});

export default AccountSetupScreen;
