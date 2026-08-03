import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Calendar, Clock, MapPin, Truck, Navigation2, Compass, ShieldCheck } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';

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

  return (
    <View style={styles.card}>
      {/* Header Bar */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeftRow}>
          <Compass size={18} color={COLORS.goldPrimary} />
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
            {getShortLocation ? getShortLocation(activeShipment?.shipment?.pickupLocation) : 'Origin'} ➔{' '}
            {getShortLocation ? getShortLocation(activeShipment?.shipment?.deliveryLocation) : 'Destination'}
          </AppText>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsRow}>
            <View style={styles.metricChip}>
              <Truck size={13} color={COLORS.goldPrimary} />
              <AppText style={styles.metricChipText}>
                {activeShipment?.shipment?.numberOfHorses || 1} Horse(s)
              </AppText>
            </View>
            <View style={styles.metricChip}>
              <ShieldCheck size={13} color={COLORS.greenActive} />
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
              <AppText style={styles.stopLocation}>
                {activeShipment?.shipment?.pickupLocation || 'Pickup address N/A'}
              </AppText>
              <View style={styles.stopMetaRow}>
                <Calendar size={12} color={COLORS.textLight} />
                <AppText style={styles.stopMetaText}>
                  Scheduled Load
                </AppText>
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
              <AppText style={styles.stopLocation}>
                {activeShipment?.shipment?.deliveryLocation || 'Delivery address N/A'}
              </AppText>
              <View style={styles.stopMetaRow}>
                <Clock size={12} color={COLORS.textLight} />
                <AppText style={styles.stopMetaText}>Target Delivery</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* GPS Map Nav Trigger Button */}
        {onLaunchMap && (
          <TouchableOpacity
            style={styles.gpsNavBtn}
            onPress={onLaunchMap}
            activeOpacity={0.85}
          >
            <Navigation2 size={16} color={COLORS.white} />
            <AppText style={styles.gpsNavBtnText}>Launch Live GPS Navigation</AppText>
          </TouchableOpacity>
        )}
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
    borderRadius: RADIUS.md,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
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
    borderBottomWidth: 1.5,
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
    fontSize: 15,
    color: COLORS.goldDarkText,
  },
  statusBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
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
    fontSize: 10,
    letterSpacing: 0.3,
  },
  greenPillText: { color: '#15803D' },
  amberPillText: { color: '#B45309' },
  cardBody: {
    padding: 16,
  },
  routeHeaderBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  routeLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.goldPrimary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  routePlaces: {
    fontFamily: FONTS.bold,
    fontSize: 18,
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
    gap: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  metricChipText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopDetails: {
    flex: 1,
  },
  stopLabel: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  stopLocation: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  stopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopMetaText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textLight,
  },
  connectorWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginVertical: 2,
  },
  verticalTrackLine: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.goldBorder,
  },
  gpsNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.goldPrimary,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    marginTop: 14,
  },
  gpsNavBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.white,
  },
});
