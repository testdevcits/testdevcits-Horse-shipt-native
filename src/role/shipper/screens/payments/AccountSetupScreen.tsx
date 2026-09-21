import React, { useState } from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { showSuccessToast } from '../../../../utils/toast';
import styles from './styles.AccountSetupScreen';

const AccountSetupScreen: React.FC<any> = ({ route, navigation }) => {
  const { url, title = 'Account Setup' } = route?.params || {};
  const [_loading, setLoading] = useState(true);
  const [webUrl, _setWebUrl] = useState<string>(url || '');

  const handleNavigationStateChange = (navState: any) => {
    // Detect Stripe Onboarding return URLs (e.g., success, return, or complete)
    if (navState.url) {
      const lowerUrl = navState.url.toLowerCase();
      if (
        lowerUrl.includes('return') ||
        lowerUrl.includes('success') ||
        lowerUrl.includes('complete')
      ) {
        showSuccessToast(
          'Onboarding Submitted',
          'Your Stripe payout account details have been updated.',
        );
        navigation.goBack();
      }
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* APP HEADER WITH GO BACK */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppIcon name="ArrowLeft" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <AppText style={styles.headerTitle}>{title}</AppText>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppIcon name="X" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* SECURE SUB-HEADER BANNER */}
      <View style={styles.securityBanner}>
        <AppIcon name="Lock" size={13} color={COLORS.saddleBrown} />
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
                <ActivityIndicator size="large" color={COLORS.saddleBrown} />
                <AppText style={styles.loaderText}>
                  Loading Stripe Verification...
                </AppText>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>
              Invalid or missing onboarding URL.
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default AccountSetupScreen;
