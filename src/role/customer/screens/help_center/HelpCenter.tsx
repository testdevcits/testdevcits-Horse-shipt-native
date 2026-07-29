import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {
  HelpCircle,
  Mail,
  X,
  ChevronRight,
  MessageCircle,
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
import { AppHeader, AppText } from '../../../../components';

const HelpCenter = ({ navigation }: any) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:noreply.horseshipt2026@gmail.com');
  };

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Help Center" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Support Card (Matching your image) */}
        <View style={styles.helpCard}>
          {/* Header Row */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.questionIconBox}>
                <HelpCircle size={22} color={COLORS.goldPrimary} />
              </View>
              <View>
                <AppText style={styles.cardTitle}>Customer Help</AppText>
                <AppText style={styles.cardSubtitle}>
                  Contact our support team
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Body Content */}
          <View style={styles.cardBody}>
            <AppText style={styles.description}>
              Need help with your customer dashboard? Send us an email and we
              will get back to you.
            </AppText>

            {/* Email Box */}
            <TouchableOpacity
              style={styles.emailHighlightBox}
              activeOpacity={0.7}
              onPress={handleEmailPress}
            >
              <View style={styles.mailIconBox}>
                <Mail size={20} color={COLORS.goldPrimary} />
              </View>
              <View>
                <AppText style={styles.emailLabel}>HELP EMAIL</AppText>
                <AppText style={styles.emailValue}>
                  noreply.horseshipt2026@gmail.com
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional FAQ Section for a complete page feel */}
        <AppText style={styles.sectionLabel}>
          Frequently Asked Questions
        </AppText>

        <View style={styles.faqContainer}>
          <FaqItem title="How to track my shipment?" />
          <FaqItem title="How do I pay my quote?" />
          <FaqItem title="Cancellation policy details" isLast />
        </View>
      </ScrollView>
    </View>
  );
};

// Sub-component for FAQ List
const FaqItem = ({ title, isLast }: { title: string; isLast?: boolean }) => (
  <TouchableOpacity
    style={[styles.faqItem, isLast && { borderBottomWidth: 0 }]}
  >
    <AppText style={styles.faqText}>{title}</AppText>
    <ChevronRight size={18} color={COLORS.grey400} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  helpCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  questionIconBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.goldLightBg,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  cardBody: {
    padding: SPACING.lg,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
    fontFamily: FONTS.medium,
  },
  emailHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  mailIconBox: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    letterSpacing: 1,
  },
  emailValue: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginLeft: 4,
  },
  faqContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  faqText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
});

export default HelpCenter;
