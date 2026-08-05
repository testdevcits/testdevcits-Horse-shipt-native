import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ShieldCheck,
  X,
  Info,
  Landmark,
  Lock,
  Link as LinkIcon,
} from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../constants';
import { AppText } from '../../../components';

import Toast from 'react-native-toast-message';
import shipperService from '../../../api/services/shipperService';

interface ConnectBankModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConnectBank?: () => void;
  onMaybeLater?: () => void;
  isLoading?: boolean;
  navigation?: any;
}

const ConnectBankModal: React.FC<ConnectBankModalProps> = ({
  isVisible,
  onClose,
  onConnectBank,
  onMaybeLater,
  isLoading: propLoading = false,
  navigation: propNavigation,
}) => {
  const navigation = propNavigation || useNavigation<any>();
  const [internalLoading, setInternalLoading] = React.useState(false);
  const isLoading = propLoading || internalLoading;

  const handleConnect = async () => {
    if (onConnectBank) {
      onConnectBank();
      return;
    }

    setInternalLoading(true);
    try {
      const createRes = await shipperService.createStripeAccount();
      if (createRes?.success) {
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
          onClose();
          setTimeout(() => {
            if (navigation?.navigate) {
              navigation.navigate('AccountSetup', {
                url: onboardingUrl,
                title: 'Account Setup',
              });
            } else {
              Linking.openURL(onboardingUrl).catch(err => {
                console.error('Failed to open onboarding URL in browser:', err);
              });
            }
          }, 150);
        } else {
          Toast.show({
            type: 'success',
            text1: 'Stripe Payout Account',
            text2: createRes.message || onboardRes?.message || 'Stripe account processed.',
          });
          onClose();
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Setup Failed',
          text2: createRes?.message || 'Failed to create Stripe payout account.',
        });
      }
    } catch (err: any) {
      console.error('Create Stripe Account Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message || 'Something went wrong setting up payout account.',
      });
    } finally {
      setInternalLoading(false);
    }
  };

  const handleLater = () => {
    if (onMaybeLater) {
      onMaybeLater();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* 1. Header Banner */}
          <View style={styles.headerBanner}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.badgeRow}>
              <ShieldCheck size={16} color={COLORS.white} />
              <AppText style={styles.badgeText}>VERIFICATION REQUIRED</AppText>
            </View>

            <AppText style={styles.bannerTitle}>
              Connect Your Bank Account
            </AppText>
            <AppText style={styles.bannerSubtitle}>
              Unlock payment capabilities with stripe
            </AppText>
          </View>

          {/* 2. Scrollable Body Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Why is this required section */}
            <View style={styles.sectionHeader}>
              <View style={styles.infoIconWrapper}>
                <Info size={16} color="#8B5A2B" />
              </View>
              <AppText style={styles.sectionTitle}>Why is this required?</AppText>
            </View>

            {/* Feature Cards Grid */}
            <View style={styles.cardsGrid}>
              {/* Card 1: Receive Payments */}
              <View style={styles.featureCard}>
                <View style={styles.cardIconBox}>
                  <Landmark size={20} color="#8B5A2B" />
                </View>
                <AppText style={styles.cardTitle}>Receive Payments</AppText>
                <AppText style={styles.cardSub}>
                  Get paid directly to your bank account
                </AppText>
              </View>

              {/* Card 2: Secure Transactions */}
              <View style={styles.featureCard}>
                <View style={styles.cardIconBox}>
                  <Lock size={20} color="#8B5A2B" />
                </View>
                <AppText style={styles.cardTitle}>Secure Transactions</AppText>
                <AppText style={styles.cardSub}>
                  Bank-level security for all payments
                </AppText>
              </View>
            </View>

            {/* Security Encryption Notice */}
            <View style={styles.encryptionCard}>
              <Lock size={18} color="#374151" style={{ marginTop: 2 }} />
              <AppText style={styles.encryptionText}>
                Your banking information is encrypted and process only by stripe. We never store your bank details.
              </AppText>
            </View>

            {/* Setup Steps Section */}
            <View style={styles.setupCard}>
              <AppText style={styles.setupTitle}>Setup Steps :</AppText>

              <View style={styles.stepItem}>
                <AppText style={styles.stepText}>
                  1. Click “Connect Bank Account” below
                </AppText>
              </View>
              <View style={styles.stepItem}>
                <AppText style={styles.stepText}>
                  2. Enter your business information
                </AppText>
              </View>
              <View style={styles.stepItem}>
                <AppText style={styles.stepText}>
                  3. Verify your bank account
                </AppText>
              </View>
              <View style={styles.stepItem}>
                <AppText style={styles.stepText}>
                  4. Start receiving payments!
                </AppText>
              </View>

              <AppText style={styles.timeNote}>Takes about 5-10minutes</AppText>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.connectBtn}
              onPress={handleConnect}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <LinkIcon size={18} color={COLORS.white} />
                  <AppText style={styles.connectBtnText}>
                    Connect Bank Account
                  </AppText>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.maybeLaterBtn}
              onPress={handleLater}
              activeOpacity={0.7}
            >
              <AppText style={styles.maybeLaterText}>Maybe Later</AppText>
            </TouchableOpacity>

            <AppText style={styles.footerNote}>
              Required to receive payments and start earning
            </AppText>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ConnectBankModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  /* Header Banner */
  headerBanner: {
    backgroundColor: '#B5874A',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: FONT_SIZE.xl + 2,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: '#F4EBE0',
  },

  /* Scrollable Content */
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  infoIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#8B5A2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: '#1F2937',
  },

  /* Cards Grid */
  cardsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#F9F8F5',
    borderWidth: 1,
    borderColor: '#EFEBE2',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1E9DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.regular,
    color: '#6B7280',
    lineHeight: 16,
  },

  /* Encryption Card */
  encryptionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#EFEBE2',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  encryptionText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: '#4B5563',
    lineHeight: 18,
  },

  /* Setup Steps Box */
  setupCard: {
    backgroundColor: '#F6F0E6',
    borderLeftWidth: 4,
    borderLeftColor: '#B5874A',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  setupTitle: {
    fontSize: FONT_SIZE.sm + 1,
    fontFamily: FONTS.bold,
    color: '#8B5A2B',
    marginBottom: SPACING.xs,
  },
  stepItem: {
    marginVertical: 2,
  },
  stepText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: '#5C441E',
    lineHeight: 20,
  },
  timeNote: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: '#8B5A2B',
    marginTop: SPACING.xs + 2,
  },

  /* Action Buttons */
  connectBtn: {
    height: 50,
    backgroundColor: '#B5874A',
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#B5874A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: SPACING.sm,
  },
  connectBtnText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  maybeLaterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs + 2,
    marginBottom: 4,
  },
  maybeLaterText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: '#374151',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.regular,
    color: '#9CA3AF',
  },
});
