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
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
import { AppHeader, AppText } from '../../../../components';

const HelpCenter = ({ navigation }: any) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:noreply.horseshipt2026@gmail.com');
  };

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Help Center" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Support Card */}
        <View style={styles.helpCard}>
          {/* Header Row */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.questionIconBox}>
                <HelpCircle size={20} color={COLORS.primary} />
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
                <Mail size={18} color={COLORS.primary} />
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

        {/* Additional FAQ Section */}
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
    <ChevronRight size={16} color={COLORS.grey400} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  helpCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
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
    padding: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  questionIconBox: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.goldLightBg,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  cardBody: {
    padding: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
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
    width: 32,
    height: 32,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  emailValue: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
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
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  faqText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
});

export default HelpCenter;
