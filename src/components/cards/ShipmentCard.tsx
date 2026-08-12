import React, { memo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { User, Info, ChevronRight, MapPin } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING, SIZES } from '../../constants';
import AppText from '../common/AppText';
import { formatDate } from '../../utils/helpers';


const ShipmentCard = ({ item, onView }: { item: any; onView: () => void }) => {
  const horsePhoto = item?.horses[0]?.photo?.url;

  // Dynamic Status Colors
  const statusColor = item?.isInProgress ? COLORS.info : COLORS.success;
  const statusBg = item?.isInProgress ? COLORS.blueLightBg : COLORS.greenBadgeBg;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onView} style={styles.card}>
      {/* Top Section: ID and Status */}
      <View style={styles.header}>
        <View>
          <AppText style={styles.shipmentCode}>{item?.shipmentCode}</AppText>
          <AppText style={styles.dateLabel}>
            Requested {formatDate(item?.pickupDateRange?.start)}
          </AppText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <AppText style={[styles.statusText, { color: statusColor }]}>
            {item?.status.toUpperCase()}
          </AppText>
        </View>
      </View>

      {/* Main Content: Route and Image */}
      <View style={styles.content}>
        <View style={styles.routeContainer}>
          {/* Visual Route Line */}
          <View style={styles.routeLineContainer}>
            <View style={[styles.routeDot, { borderColor: COLORS.primary }]} />
            <View style={styles.line} />
            <MapPin size={14} color={COLORS.error} />
          </View>

          <View style={styles.locations}>
            <AppText numberOfLines={1} style={styles.locationTitle}>{item?.pickupLocation}</AppText>
            <View style={{ height: 20 }} /> {/* Spacing for the line */}
            <AppText numberOfLines={1} style={styles.locationTitle}>{item?.deliveryLocation}</AppText>
          </View>
        </View>

        <Image
          source={{ uri: horsePhoto || 'https://via.placeholder.com/150' }}
          style={styles.horseImg}
        />
      </View>

      {/* Footer: Metadata Tags */}
      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <User size={14} color={COLORS.textLight} />
            <AppText style={styles.metaValue}>{item?.shipper?.name}</AppText>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaItem}>
            <Info size={14} color={COLORS.textLight} />
            <AppText style={styles.metaValue}>{item?.numberOfHorses} Horses</AppText>
          </View>
        </View>

        <View style={styles.chevronCircle}>
          <ChevronRight size={18} color={COLORS.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, // Use a larger radius for a modern look
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    // Soft Shadow
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  shipmentCode: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  dateLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xxs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
  },
  dot: {
    width: SPACING.xs2,
    height: SPACING.xs2,
    borderRadius: RADIUS.xs,
    marginRight: SPACING.xs2,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    letterSpacing: 0.3,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  routeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeLineContainer: {
    alignItems: 'center',
    marginRight: SPACING.md,
    height: RADIUS.circle,
    justifyContent: 'space-between',
  },
  routeDot: {
    width: SPACING.sm2,
    height: SPACING.sm2,
    borderRadius: RADIUS.xs2,
    borderWidth: SIZES.borderWidthThick,
    backgroundColor: COLORS.white,
  },
  line: {
    width: SIZES.borderWidthThin,
    flex: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.xxs,
    borderStyle: 'dashed', // Dashing requires more complex implementation in RN, so we use a solid line or a dedicated component
  },
  locations: {
    flex: 1,
    justifyContent: 'space-between',
    height: SPACING.massive,
  },
  locationTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  horseImg: {
    width: SPACING.massive,
    height: SPACING.massive,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.grey100,
    marginLeft: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: SIZES.borderWidthThin,
    borderTopColor: COLORS.grey100,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs2,
  },
  metaValue: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  divider: {
    width: SIZES.borderWidthThin,
    height: SPACING.md2,
    backgroundColor: COLORS.divider,
  },
  chevronCircle: {
    backgroundColor: COLORS.primary,
    width: SIZES.avatarSm,
    height: SIZES.avatarSm,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ShipmentCard);