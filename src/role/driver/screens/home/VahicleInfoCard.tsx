import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useState } from 'react';
import { AppText } from '../../../../components';

import {
  COLORS,
  FONTS,
  
  SPACING,
  FONT_SIZE,
} from '../../../../constants';
import AppIcon from '../../../../components/AppIcon';

const VahicleInfoCard = ({
  vehicle,
  isVehicleCollapsed,
  setIsVehicleCollapsed,
}: {
  vehicle?: any;
  isVehicleCollapsed?: any;
  setIsVehicleCollapsed?: any;
}) => {
  const [imageError, setImageError] = useState(false);

  const vehicleImageUrl = vehicle?.images?.[0]?.url;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.8}
        onPress={() => setIsVehicleCollapsed(!isVehicleCollapsed)}
      >
        <View style={styles.headerLeftRow}>
          <AppIcon name={'Truck'} size={20} color={COLORS.primary} />
          <AppText style={styles.cardHeaderTitle}>Assigned Vehicle</AppText>
        </View>
        {isVehicleCollapsed ? (
          <AppIcon name={'ChevronDown'} size={20} color={COLORS.goldDarkText} />
        ) : (
          <AppIcon name={'ChevronUp'} size={20} color={COLORS.goldDarkText} />
        )}
      </TouchableOpacity>

      {!isVehicleCollapsed && (
        <View style={styles.cardBody}>
          {/* Truck Cover Image with tag */}
          <View style={styles.vehicleImageContainer}>
            {vehicleImageUrl && !imageError ? (
              <Image
                source={{ uri: vehicleImageUrl }}
                style={styles.vehicleImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.vehicleImageFallback}>
                <AppIcon name={'Truck'} size={44} color={COLORS.primary} />
              </View>
            )}
            <View style={styles.tagBadge}>
              <AppText style={styles.tagBadgeText}>
                {vehicle?.vehicleType?.toUpperCase() || 'TRUCK'}
              </AppText>
            </View>
          </View>

          {/* Vehicle Number & Status */}
          <View style={styles.vehicleMetaRow}>
            <View style={styles.flexOne}>
              <AppText style={styles.vehicleNum}>
                {vehicle?.vehicleNumber || 'No Number'}
              </AppText>
              <AppText style={styles.vehicleSubDetails}>
                {vehicle?.transportType || 'Trucking'} •{' '}
                {vehicle?.trailerType || 'Trailer'}
              </AppText>
            </View>
            <View style={styles.readyBadge}>
              <AppIcon name={'CheckCircle2'} size={13} color={COLORS.primary} />
              <AppText style={styles.readyBadgeText}>READY</AppText>
            </View>
          </View>

          {/* Grid layout parameters */}
          <View style={styles.vehicleGrid}>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>TRAILER TYPE</AppText>
              <AppText style={styles.vValue} numberOfLines={1}>
                {vehicle?.trailerType || 'N/A'}
              </AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>STALLS</AppText>
              <AppText style={styles.vValue}>
                {vehicle?.numberOfStalls !== undefined
                  ? String(vehicle.numberOfStalls).padStart(2, '0')
                  : '01'}
              </AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>STALL SIZE</AppText>
              <AppText style={styles.vValue} numberOfLines={1}>
                {vehicle?.stallSize || 'Standard'}
              </AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>TRANSPORT</AppText>
              <AppText style={styles.vValue} numberOfLines={1}>
                {vehicle?.transportType || 'Trucking'}
              </AppText>
            </View>
          </View>

          {/* Vehicle Notes Box */}
          {vehicle?.notes ? (
            <View style={styles.notesBox}>
              <View style={styles.notesHeaderRow}>
                <AppIcon name={'FileText'} size={16} color={COLORS.primary} />
                <AppText style={styles.notesBoxLabel}>VEHICLE NOTES</AppText>
              </View>
              <AppText style={styles.notesBoxText}>
                {vehicle.notes.trim()}
              </AppText>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default memo(VahicleInfoCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    borderRadius: 20,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.grey200,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardHeaderTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.slate900,
  },
  cardBody: {
    padding: 16,
  },
  vehicleImageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: COLORS.slate100,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldLightText,
    letterSpacing: 0.5,
  },
  vehicleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flexOne: {
    flex: 1,
  },
  vehicleNum: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.slate900,
  },
  vehicleSubDetails: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate500,
    marginTop: 2,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    borderRadius: 20,
    backgroundColor: COLORS.greenLightBg,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  readyBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.greenSuccess,
    letterSpacing: 0.5,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  vehicleGridCell: {
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.grey200,
    backgroundColor: COLORS.slate50,
    borderRadius: 14,
    padding: 12,
  },
  vLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.slate400,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  vValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.slate900,
  },
  notesBox: {
    backgroundColor: COLORS.goldCreamBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: 14,
    padding: 14,
  },
  notesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  notesBoxLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  notesBoxText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldDarkText,
    lineHeight: 18,
  },
});
