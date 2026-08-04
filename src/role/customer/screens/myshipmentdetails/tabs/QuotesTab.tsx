import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { AppText } from '../../../../../components';
import {
  ChevronRight,
  Star,
  FileText,
  Clock,
  Bell,
} from 'lucide-react-native';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../../constants';
import imageIndex from '../../../../../assets/images/imageIndex';

interface QuotesTabProps {
  quotes?: any[];
  onSelectQuote?: (quote: any) => void;
}

const QuotesTab: React.FC<QuotesTabProps> = ({ quotes, onSelectQuote }) => {
  const hasQuotes = Array.isArray(quotes) && quotes.length > 0;

  return (
    <View style={styles.container}>
      {/* Total Quotes Bar */}
      <View style={styles.subHeaderBar}>
        <AppText style={styles.subHeaderText}>
          Total quotes : {quotes?.length || 0}
        </AppText>
      </View>

      {!hasQuotes ? (
        /* Empty Condition UI */
        <View style={styles.emptyCardContainer}>
          <View style={styles.emptyIconCircle}>
            <FileText size={32} color={COLORS.primary} />
          </View>

          <AppText style={styles.emptyTitle}>No Quotes Received Yet</AppText>

          <AppText style={styles.emptySubtitle}>
            Verified service providers are currently reviewing your shipment details. Quotes will appear here once submitted.
          </AppText>

          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <AppText style={styles.statusPillText}>Request Active & Searching</AppText>
          </View>

          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Clock size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>Estimated Response Time</AppText>
                <AppText style={styles.infoCardText}>
                  Quotes usually arrive within 24 to 48 hours.
                </AppText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Bell size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>Instant Notifications</AppText>
                <AppText style={styles.infoCardText}>
                  We'll notify you as soon as a new quote is received.
                </AppText>
              </View>
            </View>
          </View>
        </View>
      ) : (
        /* Main List Container (Card) */
        <View style={styles.cardContainer}>
          {/* Table Header */}
          <View style={styles.listHeader}>
            <AppText style={styles.listHeaderText}>Service provider</AppText>
            <AppText style={styles.listHeaderText}>Price (USD)</AppText>
          </View>

          {/* Quote Items */}
          {quotes.map((q: any, index: number) => (
            <TouchableOpacity
              key={q?._id || index}
              style={[
                styles.quoteRow,
                index === quotes.length - 1 && { borderBottomWidth: 0 },
              ]}
              activeOpacity={0.8}
              onPress={() => onSelectQuote?.(q)}
            >
              <View style={styles.providerInfo}>
                <Image
                  source={
                    q?.shipper?.avatar
                      ? { uri: q?.shipper?.avatar }
                      : imageIndex.AccountIcon
                  }
                  style={styles.avatar}
                />
                <View style={styles.nameAndRating}>
                  <AppText style={styles.providerName}>
                    {q?.shipper?.name || 'Provider name'}
                  </AppText>
                  <View style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={ICON_SIZE.xs}
                        color="#FBBF24"
                        fill="#FBBF24"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <AppText style={styles.priceText}>
                  ${Number(q?.totalPrice || 0).toLocaleString()}
                </AppText>
                <ChevronRight size={ICON_SIZE.sm} color={COLORS.textPrimary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default QuotesTab;

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xl,
  },
  subHeaderBar: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  subHeaderText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    overflow: 'hidden',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  listHeaderText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.grey600,
    fontFamily: FONTS.medium,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grey200,
  },
  nameAndRating: {
    marginLeft: SPACING.sm,
  },
  providerName: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  priceText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  /* Empty State Styles */
  emptyCardContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    marginBottom: SPACING.xl,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.greenActive,
  },
  statusPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semiBold,
    color: COLORS.greenSuccess,
  },
  infoCardsContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  infoCardText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

