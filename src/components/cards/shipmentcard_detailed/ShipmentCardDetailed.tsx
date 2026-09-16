import React, { memo, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../constants';
import AppText from '../../common/AppText';
import { horsePlaceholderImage } from '../../../config/constants';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.shipmentCardDetail';

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
        {imageError ? (
          <Image
            source={{
              uri: horsePlaceholderImage,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{
              uri: horse?.photo?.url || horsePlaceholderImage,
            }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}

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
            <View style={styles.action}>
              {isDraft && onDelete && (
                <TouchableOpacity
                  style={styles.deleteIconBtn}
                  onPress={(e: any) => {
                    e?.stopPropagation?.();
                    onDelete(item);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <AppIcon
                    name="Trash2"
                    size={ICON_SIZE.xs || 16}
                    color={COLORS.error}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.exportBtn}>
                <AppIcon
                  name="ExternalLink"
                  size={ICON_SIZE.xs}
                  color={COLORS.white}
                />
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
            <AppIcon name="MapPin" size={ICON_SIZE.xs} color={COLORS.grey500} />
            <AppText style={styles.infoText} numberOfLines={1}>
              {item?.pickupLocation}
            </AppText>
          </View>

          {/* Date Row (Pickup Date) */}
          <View style={styles.infoRow}>
            <AppIcon
              name="Calendar"
              size={ICON_SIZE.xs}
              color={COLORS.grey500}
            />
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
            <AppIcon
              name="Truck"
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

 

export default ShipmentHorizontalCard;
