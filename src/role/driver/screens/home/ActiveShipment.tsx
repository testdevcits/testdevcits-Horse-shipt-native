import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Calendar, Clock, MapPin, Truck } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { COLORS, FONTS } from '../../../../constants';

const ActiveShipment = ({ activeShipment, getShortLocation }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AppText style={styles.cardHeaderTitle}>Current Shipment</AppText>
      </View>

      <View style={styles.cardBody}>
        {/* Active Route Box */}
        <View style={styles.routeHeaderBox}>
          <AppText style={styles.routeLabel}>ACTIVE ROUTE</AppText>
          <AppText style={styles.routePlaces}>
            {getShortLocation(activeShipment?.shipment?.pickupLocation)} ➔{' '}
            {getShortLocation(activeShipment?.shipment?.deliveryLocation)}
          </AppText>

          <View style={styles.horseCountBadge}>
            <Truck
              size={14}
              color={COLORS.goldPrimary}
              style={styles.badgeIcon}
            />
            <AppText style={styles.horseCountText}>
              {activeShipment?.shipment?.numberOfHorses} Horse Shipment
            </AppText>
          </View>
        </View>

        {/* Trip Status Row */}
        <View style={styles.tripStatusRow}>
          <AppText style={styles.tripStatusLabel}>Trip Status</AppText>
          <View style={styles.statusIndicatorRow}>
            <View style={styles.greenActiveDot} />
            <AppText style={styles.greenActiveText}>
              {activeShipment?.tripStatus === 'inTransit'
                ? 'IN TRANSIT'
                : activeShipment?.tripStatus?.toUpperCase()}
            </AppText>
          </View>
        </View>

        {/* Pickup Block */}
        <View style={styles.stopCard}>
          <View style={styles.stopIconContainer}>
            <MapPin size={18} color={COLORS.white} />
          </View>
          <View style={styles.stopDetails}>
            <AppText style={styles.stopLabel}>PICKUP</AppText>
            <AppText style={styles.stopLocation}>
              {activeShipment?.shipment?.pickupLocation}
            </AppText>
            <View style={styles.stopMetaRow}>
              <Calendar size={13} color={COLORS.textLight} />
              <AppText style={styles.stopMetaText}>
                {activeShipment?.shipment?.createdAt || 'N/A'}
              </AppText>
              <Clock
                size={13}
                color={COLORS.textLight}
                style={styles.metaSpacing}
              />
            </View>
          </View>
        </View>

        {/* Dashed Connecting Line */}
        <View style={styles.connectorWrapper}>
          <View style={styles.dashedLine} />
          <View style={styles.dashedCenterDot} />
          <View style={styles.dashedLine} />
        </View>

        {/* Delivery Block */}
        <View style={styles.stopCard}>
          <View style={styles.stopIconContainer}>
            <MapPin size={18} color={COLORS.white} />
          </View>
          <View style={styles.stopDetails}>
            <AppText style={styles.stopLabel}>DELIVERY</AppText>
            <AppText style={styles.stopLocation}>
              {activeShipment?.shipment?.deliveryLocation}
            </AppText>
            <View style={styles.stopMetaRow}>
              <Calendar size={13} color={COLORS.textLight} />
              <AppText style={styles.stopMetaText}>N/A</AppText>
              <Clock
                size={13}
                color={COLORS.textLight}
                style={styles.metaSpacing}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActiveShipment;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
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
  horseCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeIcon: {
    marginRight: 6,
  },
  horseCountText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.goldDarkText,
  },
  routeHeaderBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  routeLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.goldPrimary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  routePlaces: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  tripStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tripStatusLabel: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.textLight,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.greenActive,
    marginRight: 6,
  },
  greenActiveText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.greenActive,
  },
  stopCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  stopIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: COLORS.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stopDetails: {
    flex: 1,
  },
  stopLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.goldPrimary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  stopLocation: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  stopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopMetaText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  metaSpacing: {
    marginLeft: 12,
  },
  connectorWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    position: 'relative',
  },
  dashedLine: {
    width: 1,
    height: 10,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderStyle: 'dashed',
  },
  dashedCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.goldPrimary,
    backgroundColor: COLORS.goldLightBg,
    marginVertical: 2,
  },
});
