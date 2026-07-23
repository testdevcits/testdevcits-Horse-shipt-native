 

import React, { memo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Calendar, ExternalLink, Truck } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

const ShipmentHorizontalCard = memo(({ item, onPress }: { item: any; onPress: () => void }) => {
  const horse = item.horses[0];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>

      {/* 1. Left Section: Horse Image */}
      <Image
        source={{ uri:  horse.photo.url || 'https://via.placeholder.com/150' }}
        style={styles.image}
      />

      {/* 2. Middle Section: Details */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <AppText style={styles.title} numberOfLines={2}>
            {item.horsesCount || 1} Horse Shipping from {item.origin} to {item.destination}
          </AppText>

          {/* External Link Button */}
          <TouchableOpacity style={styles.exportBtn}>
            <ExternalLink size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={styles.statusRow}>
          <AppText style={styles.label}>Delivery</AppText>
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>Today</AppText>
          </View>
        </View>

        {/* Address Row */}
        <View style={styles.infoRow}>
          <MapPin size={20} color={COLORS.grey500} />
          <AppText style={styles.infoText}>{item.address || 'Address Name here'}</AppText>
        </View>

        {/* Date Row */}
        <View style={styles.infoRow}>
          <Calendar size={20} color={COLORS.grey500} />
          <AppText style={styles.infoText}>{item.date || 'January 02, 2024'}</AppText>
        </View>
      </View>

      {/* 3. Right Section: Vertical Progress Timeline */}
      <View style={styles.timelineContainer}>
        <View style={styles.dot} />
        <View style={styles.dashedLine} />
        <View style={styles.truckCircle}>
          <Truck size={14} color={COLORS.greenPrimary} fill={COLORS.greenPrimary} />
        </View>
        <View style={styles.dashedLine} />
        <View style={styles.dot} />
      </View>

    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    height: 180, // Fixed height to match design aspect ratio
    marginVertical: SPACING.sm,
    marginHorizontal:SPACING.sm
  },
  image: {
    width: '40%',
    height: '100%',
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
    lineHeight: 22,
    paddingRight: SPACING.sm,
  },
  exportBtn: {
    backgroundColor: COLORS.primary, // Gold color #B69556
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.grey800,
  },
  badge: {
    borderWidth: 1.5,
    borderColor: COLORS.greenActive,
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: 14 ,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  badgeText: {
    color: COLORS.greenActive,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.grey700,
  },
  /* Timeline Styles */
  timelineContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
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
    width: 32,
    height: 32,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.greenActive,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
});

export default ShipmentHorizontalCard;