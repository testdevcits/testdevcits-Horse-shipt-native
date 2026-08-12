import React, { memo, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Calendar, ExternalLink, Truck, Trash2 } from 'lucide-react-native';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../constants';
import AppText from '../common/AppText';
import { horsePlaceholderImage } from '../../config/constants';

// Helper to format date (e.g., "2026-07-27..." -> "July 27, 2026")
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper to clean up status strings (e.g., "open_for_offers" -> "Open For Offers")
const formatStatus = (status: string) => {
  if (!status) return 'Unknown';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to extract City/Country from a full address string for the title
const getShortLocation = (address: string) => {
  if (!address) return '';
  const parts = address.split(',');
  if (parts.length < 2) return address;
  return `${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim()}`;
};

const ShipmentHorizontalCard = memo(
  ({
    item,
    onPress,
    onDelete,
  }: {
    item: any;
    onPress: () => void;
    onDelete?: (item: any) => void;
  }) => {
    const [imageError, setImageError] = useState(false);

    const horse = item?.horses?.[0];
    const pickupDate = formatDate(item?.pickupDateRange?.start);
    const statusLabel = formatStatus(item?.status);

    const isDraft = item?.publish === false;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={onPress}
      >
        {/* 1. Left Section: Horse Image */}
        {
          imageError ?
            <Image
              source={{
                uri: horsePlaceholderImage
              }}
              style={styles.image}
              resizeMode="cover"
            />
            :
            <Image
              source={{
                uri:
                  horse?.photo?.url || horsePlaceholderImage
              }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
        }

        {/* 2. Middle Section: Details */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <AppText style={styles.title} numberOfLines={2}>
              {item?.numberOfHorses}{' '}
              {item?.numberOfHorses > 1 ? 'Horses' : 'Horse'} from{' '}
              {getShortLocation(item?.pickupLocation)} to{' '}
              {getShortLocation(item?.deliveryLocation)}
            </AppText>

            {/* Shipment Code / External Action / Delete Action */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {isDraft && onDelete && (
                <TouchableOpacity
                  style={styles.deleteIconBtn}
                  onPress={(e: any) => {
                    e?.stopPropagation?.();
                    onDelete(item);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash2 size={ICON_SIZE.xs || 16} color={COLORS.error} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.exportBtn}>
                <ExternalLink size={ICON_SIZE.xs} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Badge */}
          <View style={styles.statusRow}>
            <AppText style={styles.label}>Status</AppText>
            <View
              style={[
                styles.badge,
                {
                  borderColor:
                    item?.status === 'open_for_offers'
                      ? COLORS.greenActive
                      : COLORS.primary,
                },
              ]}
            >
              <AppText
                style={[
                  styles.badgeText,
                  {
                    color:
                      item?.status === 'open_for_offers'
                        ? COLORS.greenActive
                        : COLORS.primary,
                  },
                ]}
              >
                {statusLabel}
              </AppText>
            </View>
          </View>

          {/* Address Row (Pickup Location) */}
          <View style={styles.infoRow}>
            <MapPin size={ICON_SIZE.xs} color={COLORS.grey500} />
            <AppText style={styles.infoText} numberOfLines={1}>
              {item?.pickupLocation}
            </AppText>
          </View>

          {/* Date Row (Pickup Date) */}
          <View style={styles.infoRow}>
            <Calendar size={ICON_SIZE.xs} color={COLORS.grey500} />
            <AppText style={styles.infoText}>{pickupDate}</AppText>
          </View>
        </View>

        {/* 3. Right Section: Vertical Progress Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.dot} />
          <View style={styles.dashedLine} />
          <View
            style={[
              styles.truckCircle,
              {
                borderColor:
                  item?.status === 'delivered'
                    ? COLORS.greenActive
                    : COLORS.grey300,
              },
            ]}
          >
            <Truck
              size={ICON_SIZE.xs}
              color={
                item?.status === 'open_for_offers'
                  ? COLORS.grey400
                  : COLORS.greenPrimary
              }
              fill={
                item?.status === 'open_for_offers'
                  ? 'transparent'
                  : COLORS.greenPrimary
              }
            />
          </View>
          <View style={styles.dashedLine} />
          <View style={styles.dot} />
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.xs,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  image: {
    width: '32%',
    height: '100%',
    backgroundColor: COLORS.grey100,
  },
  content: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
    lineHeight: 16,
    paddingRight: SPACING.xs,
  },
  exportBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xs,
    borderRadius: RADIUS.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: 2,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
  },
  badge: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 1,
    borderRadius: RADIUS.round,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey700,
  },

  /* Timeline Styles */
  timelineContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.grey50,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.grey300,
    backgroundColor: COLORS.white,
  },
  dashedLine: {
    width: 1,
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.grey300,
    marginVertical: 2,
  },
  truckCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  deleteIconBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
});

export default ShipmentHorizontalCard;