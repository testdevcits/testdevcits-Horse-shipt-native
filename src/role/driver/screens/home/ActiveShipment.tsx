import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Calendar, Clock, MapPin, Truck, Compass, ShieldCheck } from 'lucide-react-native';
import { AppText, Button } from '../../../../components';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';

const ActiveShipment = ({
  activeShipment,
  getShortLocation,
  onLaunchMap,
}: {
  activeShipment?: any;
  getShortLocation?: any;
  onLaunchMap?: () => void;
}) => {
  const isTripInTransit = activeShipment?.tripStatus === 'inTransit' || activeShipment?.tripStatus === 'started';

  const pickupLoc = activeShipment?.shipment?.pickupLocation || 'Pickup address N/A';
  const deliveryLoc = activeShipment?.shipment?.deliveryLocation || 'Delivery address N/A';

  const originShort = getShortLocation ? getShortLocation(pickupLoc) : 'Origin';
  const destShort = getShortLocation ? getShortLocation(deliveryLoc) : 'Destination';

  return (
    <View style={styles.card}>
      {/* Header Bar */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeftRow}>
          <Compass size={20} color={COLORS.primary} />
          <AppText style={styles.cardHeaderTitle}>Active Dispatch Manifest</AppText>
        </View>
        <View style={[styles.statusBadgePill, isTripInTransit ? styles.transitPill : styles.pendingPill]}>
          <View style={[styles.statusDot, isTripInTransit ? styles.greenDot : styles.amberDot]} />
          <AppText style={[styles.statusPillText, isTripInTransit ? styles.greenPillText : styles.amberPillText]}>
            {isTripInTransit ? 'IN TRANSIT' : activeShipment?.tripStatus?.toUpperCase() || 'ASSIGNED'}
          </AppText>
        </View>
      </View>

      <View style={styles.cardBody}>
        {/* Route Header Overview Box */}
        <View style={styles.routeHeaderBox}>
          <AppText style={styles.routeLabel}>DIRECT DISPATCH ROUTE</AppText>
          <AppText style={styles.routePlaces} numberOfLines={1}>
            {originShort} ➔ {destShort}
          </AppText>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsRow}>
            <View style={styles.metricChip}>
              <Truck size={14} color={COLORS.primary} />
              <AppText style={styles.metricChipText}>
                {activeShipment?.shipment?.numberOfHorses || 1} Horse(s)
              </AppText>
            </View>
            <View style={styles.metricChip}>
              <ShieldCheck size={14} color={COLORS.greenActive} />
              <AppText style={styles.metricChipText}>Insured Load</AppText>
            </View>
          </View>
        </View>

        {/* Vertical Route Timeline */}
        <View style={styles.timelineContainer}>
          {/* Pickup Node */}
          <View style={styles.stopCard}>
            <View style={[styles.nodeIconCircle, { backgroundColor: '#10B981' }]}>
              <MapPin size={16} color={COLORS.white} />
            </View>
            <View style={styles.stopDetails}>
              <AppText style={styles.stopLabel}>PICKUP LOCATION</AppText>
              <AppText style={styles.stopLocation}>{pickupLoc}</AppText>
              <View style={styles.stopMetaRow}>
                <Calendar size={13} color={COLORS.textSecondary} />
                <AppText style={styles.stopMetaText}>Scheduled Load</AppText>
              </View>
            </View>
          </View>

          {/* Vertical Connecting Track */}
          <View style={styles.connectorWrapper}>
            <View style={styles.verticalTrackLine} />
          </View>

          {/* Delivery Node */}
          <View style={styles.stopCard}>
            <View style={[styles.nodeIconCircle, { backgroundColor: '#EF4444' }]}>
              <MapPin size={16} color={COLORS.white} />
            </View>
            <View style={styles.stopDetails}>
              <AppText style={styles.stopLabel}>DROP-OFF LOCATION</AppText>
              <AppText style={styles.stopLocation}>{deliveryLoc}</AppText>
              <View style={styles.stopMetaRow}>
                <Clock size={13} color={COLORS.textSecondary} />
                <AppText style={styles.stopMetaText}>Target Delivery</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* GPS Map Nav Trigger Button */}
        {onLaunchMap && (
          <View style={{ marginTop: SPACING.md }}>
            <Button title="Launch Live GPS Navigation" onPress={onLaunchMap} />
          </View>
        )}
      </View>
    </View>
  );
};

export default ActiveShipment;

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
  cardHeader: {
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
  statusBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  transitPill: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  pendingPill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  greenDot: { backgroundColor: '#16A34A' },
  amberDot: { backgroundColor: '#D97706' },
  statusPillText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    letterSpacing: 0.5,
  },
  greenPillText: { color: '#15803D' },
  amberPillText: { color: '#B45309' },
  cardBody: {
    padding: 16,
  },
  routeHeaderBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  routeLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  routePlaces: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  metricChipText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldDarkText,
  },
  timelineContainer: {
    marginVertical: 4,
  },
  stopCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: 12,
    alignItems: 'center',
  },
  nodeIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopDetails: {
    flex: 1,
  },
  stopLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.mini,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  stopLocation: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  stopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopMetaText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  connectorWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    marginVertical: 2,
  },
  verticalTrackLine: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.goldBorder,
  },
});


