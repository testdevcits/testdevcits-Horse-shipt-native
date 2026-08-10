import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useState } from 'react';
import { AppText } from '../../../../components';
import { ChevronDown, ChevronUp, Truck, FileText, CheckCircle2 } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';

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
          <Truck size={20} color={COLORS.primary} />
          <AppText style={styles.cardHeaderTitle}>Assigned Vehicle</AppText>
        </View>
        {isVehicleCollapsed ? (
          <ChevronDown size={20} color={COLORS.goldDarkText} />
        ) : (
          <ChevronUp size={20} color={COLORS.goldDarkText} />
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
                <Truck size={44} color={COLORS.primary} />
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
                {vehicle?.transportType || 'Trucking'} • {vehicle?.trailerType || 'Trailer'}
              </AppText>
            </View>
            <View style={styles.readyBadge}>
              <CheckCircle2 size={13} color={COLORS.primary} />
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
                {vehicle?.numberOfStalls !== undefined ? String(vehicle.numberOfStalls).padStart(2, '0') : '01'}
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
                <FileText size={16} color={COLORS.primary} />
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
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.goldLightBg,
    borderBottomWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.goldDarkText,
  },
  cardBody: {
    padding: 16,
  },
  vehicleImageContainer: {
    width: '100%',
    height: 170,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: COLORS.grey100,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.goldLightBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xs,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tagBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldDarkText,
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
    color: COLORS.textPrimary,
  },
  vehicleSubDetails: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldLightBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  readyBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  vehicleGridCell: {
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.xs,
    padding: 12,
  },
  vLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.mini,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  vValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
  },
  notesBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
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
