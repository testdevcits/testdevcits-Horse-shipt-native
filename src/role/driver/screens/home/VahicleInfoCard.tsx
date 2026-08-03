import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { AppText } from '../../../../components';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS, FONTS } from '../../../../constants';

const VahicleInfoCard = ({
  vehicle,
  isVehicleCollapsed,
  setIsVehicleCollapsed,
}: {
  vehicle?: any;
  isVehicleCollapsed?: any;
  setIsVehicleCollapsed?: any;
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.9}
        onPress={() => setIsVehicleCollapsed(!isVehicleCollapsed)}
      >
        <AppText style={styles.cardHeaderTitle}>Assigned Vehicle</AppText>
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
            {vehicle?.images?.[0]?.url ? (
              <Image
                source={{ uri: vehicle?.images[0].url }}
                style={styles.vehicleImage}
              />
            ) : (
              <View style={styles.vehicleImageFallback} />
            )}
            <View style={styles.tagBadge}>
              <AppText style={styles.tagBadgeText}>TRUCK</AppText>
            </View>
          </View>

          {/* Vehicle Number & Status */}
          <View style={styles.vehicleMetaRow}>
            <View style={styles.flexOne}>
              <AppText style={styles.vehicleNum}>
                {vehicle?.vehicleNumber}
              </AppText>
              <AppText style={styles.vehicleSubDetails}>
                {vehicle?.transportType} • {vehicle?.trailerType}
              </AppText>
            </View>
            <View style={styles.readyBadge}>
              <AppText style={styles.readyBadgeText}>READY</AppText>
            </View>
          </View>

          {/* Grid layout parameters */}
          <View style={styles.vehicleGrid}>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>TRAILER</AppText>
              <AppText style={styles.vValue} numberOfLines={1}>
                {vehicle?.trailerType}
              </AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>STALLS</AppText>
              <AppText style={styles.vValue}>{vehicle?.numberOfStalls}</AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>STALL SIZE</AppText>
              <AppText style={styles.vValue}>{vehicle?.stallSize}</AppText>
            </View>
            <View style={styles.vehicleGridCell}>
              <AppText style={styles.vLabel}>TRANSPORT</AppText>
              <AppText style={styles.vValue}>{vehicle?.transportType}</AppText>
            </View>
          </View>

          {/* Vehicle Notes Box */}
          {vehicle?.notes && (
            <View style={styles.notesBox}>
              <AppText style={styles.notesBoxLabel}>VEHICLE NOTES</AppText>
              <AppText style={styles.notesBoxText}>
                {vehicle?.notes.trim()}
              </AppText>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default memo(VahicleInfoCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.goldLightBg,
    borderBottomWidth: 1.5,
    borderColor: COLORS.goldBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardHeaderTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.goldDarkText,
  },
  cardBody: {
    padding: 16,
  },
  vehicleImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  vehicleImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.grey200,
  },
  tagBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
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
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  vehicleSubDetails: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  readyBadge: {
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    borderRadius: 4,
    backgroundColor: COLORS.goldLightBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  readyBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.goldPrimary,
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
    borderColor: COLORS.border,
    backgroundColor: COLORS.grey50,
    borderRadius: 6,
    padding: 12,
  },
  vLabel: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.textLight,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  vValue: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  notesBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  notesBoxLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.goldPrimary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesBoxText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
