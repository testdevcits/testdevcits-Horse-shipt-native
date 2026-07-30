import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { AppText } from '../../../../../components';
import { ChevronRight, Star } from 'lucide-react-native';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../../constants';
import imageIndex from '../../../../../assets/images/imageIndex';

const QuotesTab = ({ quotes, onSelectQuote }: any) => (
  <View style={styles.container}>
    {/* Total Quotes Bar */}
    <View style={styles.subHeaderBar}>
      <AppText style={styles.subHeaderText}>
        Total quotes : {quotes?.length || 0}
      </AppText>
    </View>

    {/* Main List Container (Card) */}
    <View style={styles.cardContainer}>
      {/* Table Header */}
      <View style={styles.listHeader}>
        <AppText style={styles.listHeaderText}>Service provider</AppText>
        <AppText style={styles.listHeaderText}>Price (USD)</AppText>
      </View>

      {/* Quote Items */}
      {quotes?.map((q: any, index: number) => (
        <TouchableOpacity
          key={q._id || index}
          style={[
            styles.quoteRow,
            index === quotes.length - 1 && { borderBottomWidth: 0 },
          ]}
          activeOpacity={0.8}
          onPress={() => onSelectQuote(q)}
        >
          <View style={styles.providerInfo}>
            <Image
              source={
                q.shipper?.avatar
                  ? { uri: q.shipper?.avatar }
                  : imageIndex.AccountIcon
              }
              style={styles.avatar}
            />
            <View style={styles.nameAndRating}>
              <AppText style={styles.providerName}>
                {q.shipper?.name || 'Provider name'}
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
              ${Number(q.totalPrice || 0).toLocaleString()}
            </AppText>
            <ChevronRight size={ICON_SIZE.sm} color={COLORS.textPrimary} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default QuotesTab;

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xl,
  },
  subHeaderBar: {
    backgroundColor: '#F7F1E6',
    padding: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xs,
  },
  subHeaderText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: '#333',
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
    color: '#4B5563',
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
});
