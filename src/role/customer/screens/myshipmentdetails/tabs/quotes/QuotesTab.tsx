import React from 'react';
import {   TouchableOpacity, View, Image } from 'react-native';
import { AppText } from '../../../../../../components';
import {
  COLORS,
 
  ICON_SIZE,
} from '../../../../../../constants';
import imageIndex from '../../../../../../assets/images/imageIndex';
import AppIcon from '../../../../../../components/AppIcon';
import styles from './styles.QuotesTab';

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
            <AppIcon name={'FileText'} size={32} color={COLORS.primary} />
          </View>

          <AppText style={styles.emptyTitle}>No Quotes Received Yet</AppText>

          <AppText style={styles.emptySubtitle}>
            Verified service providers are currently reviewing your shipment
            details. Quotes will appear here once submitted.
          </AppText>

          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <AppText style={styles.statusPillText}>
              Request Active & Searching
            </AppText>
          </View>

          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <AppIcon name={'Clock'} size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>
                  Estimated Response Time
                </AppText>
                <AppText style={styles.infoCardText}>
                  Quotes usually arrive within 24 to 48 hours.
                </AppText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <AppIcon name={'Bell'} size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>
                  Instant Notifications
                </AppText>
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
                      <AppIcon
                        key={s}
                        name={'Star'}
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
                <AppIcon
                  name={'ChevronRight'}
                  size={ICON_SIZE.sm}
                  color={COLORS.textPrimary}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default QuotesTab;

 
