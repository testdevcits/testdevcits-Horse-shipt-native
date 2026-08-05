import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Building2, Check, ArrowRight, Shield, Lock, X, ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AppText } from '../../../../../components';
import { COLORS, FONTS, FONT_SIZE, SPACING, RADIUS } from '../../../../../constants';
import shipperService from '../../../../../api/services/shipperService';
import styles from './styles.paymentstab';

interface Props {
  stripeStatus: any;
  navigation?: any;
  onConnectPayout?: () => void;
  onRefreshStripeStatus?: () => void;
}

const PaymentsTab: React.FC<Props> = ({
  stripeStatus,
  navigation,
  onConnectPayout,
  onRefreshStripeStatus,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);

  const isConnected =
    stripeStatus?.verified ||
    stripeStatus?.chargesEnabled ||
    stripeStatus?.onboardingCompleted;

  const handleSetupPayout = async () => {
    setIsConnecting(true);
    try {
      // 1. Call Create Account (/api/shipper/stripe/create-account)
      const createRes = await shipperService.createStripeAccount();

      if (createRes?.success) {
        // 2. Call Onboarding API (/api/shipper/stripe/onboarding)
        const onboardRes = await shipperService.getStripeOnboarding().catch(() => null);

        const onboardingUrl =
          onboardRes?.onboardingUrl ||
          onboardRes?.onBoardingUrl ||
          onboardRes?.url ||
          onboardRes?.data?.onBoardingUrl ||
          onboardRes?.data?.onboardingUrl ||
          onboardRes?.data?.url ||
          createRes?.accountLinkUrl ||
          createRes?.url;

        if (onboardingUrl) {
          if (navigation?.navigate) {
            navigation.navigate('AccountSetup', {
              url: onboardingUrl,
              title: 'Account Setup',
            });
          } else {
            setWebViewUrl(onboardingUrl);
          }
        } else {
          Toast.show({
            type: 'success',
            text1: 'Stripe Payout Account',
            text2: createRes.message || onboardRes?.message || 'Stripe account processed.',
          });
        }

        if (onRefreshStripeStatus) {
          onRefreshStripeStatus();
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Payout Setup Error',
          text2: createRes?.message || 'Failed to create Stripe payout account.',
        });
      }
    } catch (err: any) {
      console.error('Stripe Onboarding Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          err?.response?.data?.message ||
          'Something went wrong setting up Stripe onboarding.',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <View style={styles.tabSection}>
      <AppText style={styles.sectionHeaderTitle}>Payment Settings</AppText>
      <AppText style={styles.sectionHeaderSub}>
        Set up your payout account to securely receive payments for completed horse shipments.
      </AppText>

      {/* Red Alert Banner if not created/connected */}
      {!isConnected && (
        <View style={styles.redAlertBanner}>
          <AppText style={styles.redAlertText}>Stripe account not created</AppText>
        </View>
      )}

      {/* Payout Account Main Card */}
      <View style={styles.payoutMainCard}>
        {/* Top Account Header */}
        <View style={styles.payoutAccountCard}>
          <View style={styles.goldHorseIconBox}>
            <Building2 size={22} color="#A06333" />
          </View>
          <View style={styles.payoutTextCol}>
            <AppText style={styles.payoutTitle}>Horse Shipper Payout Account</AppText>
            <AppText style={styles.payoutSub}>
              Receive payments for completed shipments
            </AppText>
          </View>

          <View style={isConnected ? styles.connectedBadge : styles.notConnectedBadge}>
            <AppText style={isConnected ? styles.connectedBadgeText : styles.notConnectedBadgeText}>
              {isConnected ? 'Connected' : 'Not connected'}
            </AppText>
          </View>
        </View>

        {!isConnected ? (
          <>
            <View style={styles.cardDivider} />

            {/* Stepper Progress Bar */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepperNode}>
                <View style={styles.stepperCircleActive}>
                  <View style={styles.stepperDotActive} />
                </View>
                <AppText style={styles.stepperLabelActive}>Create account</AppText>
              </View>

              <View style={styles.stepperLine} />

              <View style={styles.stepperNode}>
                <View style={styles.stepperCircleInactive} />
                <AppText style={styles.stepperLabelInactive}>Complete setup</AppText>
              </View>

              <View style={styles.stepperLine} />

              <View style={styles.stepperNode}>
                <View style={styles.stepperCircleInactive} />
                <AppText style={styles.stepperLabelInactive}>Verify identity</AppText>
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Description & Action Button */}
            <View style={styles.payoutActionSection}>
              <AppText style={styles.connectDescription}>
                Connect your payout account to start receiving payments for your horse shipments.
              </AppText>

              <TouchableOpacity
                style={styles.setupPayoutBtn}
                onPress={handleSetupPayout}
                disabled={isConnecting}
                activeOpacity={0.85}
              >
                {isConnecting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <AppText style={styles.setupPayoutBtnText}>Set up payout account</AppText>
                    <ArrowRight size={16} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.cardDivider} />
            {/* Verified Payout Card */}
            <View style={styles.verifiedCard}>
              <View style={styles.checkSquare}>
                <Check size={16} color="#A06333" />
              </View>
              <View style={styles.verifiedTextCol}>
                <AppText style={styles.verifiedTitle}>Payout Account Verified</AppText>
                <AppText style={styles.verifiedSub}>
                  Your payout account is connected and ready to receive payments for completed shipments.
                </AppText>
              </View>
            </View>
          </>
        )}

        {/* Footer Encryption Bar */}
        <View style={styles.encryptionFooterBar}>
          <Shield size={13} color="#A06333" />
          <AppText style={styles.encryptionFooterText}>
            ALL TRANSACTIONS ARE ENCRYPTED AND SECURELY PROCESSED THROUGH YOUR PAYOUT ACCOUNT.
          </AppText>
        </View>
      </View>

      {/* FALLBACK IN-APP WEBVIEW MODAL */}
      <Modal
        visible={!!webViewUrl}
        animationType="slide"
        onRequestClose={() => setWebViewUrl(null)}
      >
        <SafeAreaView style={modalStyles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
          <View style={modalStyles.headerRow}>
            <TouchableOpacity
              style={modalStyles.backBtn}
              onPress={() => setWebViewUrl(null)}
            >
              <ArrowLeft size={22} color={COLORS.textPrimary || '#0F172A'} />
            </TouchableOpacity>

            <AppText style={modalStyles.headerTitle}>Account Setup</AppText>

            <TouchableOpacity
              style={modalStyles.closeBtn}
              onPress={() => setWebViewUrl(null)}
            >
              <X size={20} color={COLORS.textSecondary || '#64748B'} />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.securityBanner}>
            <Lock size={13} color="#A06333" />
            <AppText style={modalStyles.securityBannerText}>
              Secured Connection • Stripe Encrypted Payout Verification
            </AppText>
          </View>

          {!!webViewUrl && (
            <WebView
              source={{ uri: webViewUrl }}
              style={{ flex: 1 }}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={modalStyles.loaderOverlay}>
                  <ActivityIndicator size="large" color="#A06333" />
                </View>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const modalStyles = StyleSheet.create({
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
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: '#8C5226',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentsTab;
