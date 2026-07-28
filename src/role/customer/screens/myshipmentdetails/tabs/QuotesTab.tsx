import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { AppText } from '../../../../../components';
import { ChevronRight, Star } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import imageIndex from '../../../../../assets/images/imageIndex';

const QuotesTab = ({ quotes, onSelectQuote }: any) => (
  <View style={styles.container}>
    {/* Total Quotes Bar */}
    <View style={styles.subHeaderBar}>
      <AppText style={styles.subHeaderText}>
        Total quotes : {quotes.length}
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
      {quotes.map((q: any, index: number) => (
        <TouchableOpacity
          key={q._id || index}
          style={[
            styles.quoteRow,
            index === quotes.length - 1 && { borderBottomWidth: 0 }, // Remove border for last item
          ]}
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
                    size={14}
                    color="#FBBF24" // Specific Gold/Amber color
                    fill="#FBBF24"
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <AppText style={styles.priceText}>
              ${Number(q.totalPrice).toLocaleString()}
            </AppText>
            <ChevronRight size={20} color={COLORS.textPrimary} />
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
    backgroundColor: '#F7F1E6', // Light beige to match image
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.xs,
  },
  subHeaderText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#333',
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    overflow: 'hidden', // Ensures borders don't overlap rounded corners
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  listHeaderText: {
    fontSize: 14,
    color: '#4B5563', // Grey text
    fontFamily: FONTS.medium,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.grey200,
  },
  nameAndRating: {
    marginLeft: SPACING.md,
  },
  providerName: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
});
