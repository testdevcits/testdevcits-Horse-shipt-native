import { View } from 'react-native';
import React from 'react';

import { AppText, Button } from '../../../../components';
import { COLORS, SPACING } from '../../../../constants';
import AppIcon from '../../../../components/AppIcon';
import styles from './styles.ActiveShipment';

const ActiveShipment = ({
  activeShipment,
  getShortLocation,
  onLaunchMap,
}: {
  activeShipment?: any;
  getShortLocation?: any;
  onLaunchMap?: () => void;
}) => {
  const isTripInTransit =
    activeShipment?.tripStatus === 'inTransit' ||
    activeShipment?.tripStatus === 'started';

  const pickupLoc =
    activeShipment?.shipment?.pickupLocation || 'Pickup address N/A';
  const deliveryLoc =
    activeShipment?.shipment?.deliveryLocation || 'Delivery address N/A';

  const originShort = getShortLocation ? getShortLocation(pickupLoc) : 'Origin';
  const destShort = getShortLocation
    ? getShortLocation(deliveryLoc)
    : 'Destination';

  return (
    <View style={styles.card}>
      {/* Header Bar */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeftRow}>
          <AppIcon name={'Compass'} size={20} color={COLORS.primary} />
          <AppText style={styles.cardHeaderTitle}>
            Active Dispatch Manifest
          </AppText>
        </View>
        <View
          style={[
            styles.statusBadgePill,
            isTripInTransit ? styles.transitPill : styles.pendingPill,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isTripInTransit ? styles.greenDot : styles.amberDot,
            ]}
          />
          <AppText
            style={[
              styles.statusPillText,
              isTripInTransit ? styles.greenPillText : styles.amberPillText,
            ]}
          >
            {isTripInTransit
              ? 'IN TRANSIT'
              : activeShipment?.tripStatus?.toUpperCase() || 'ASSIGNED'}
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
              <AppIcon name={'Truck'} size={14} color={COLORS.primary} />
              <AppText style={styles.metricChipText}>
                {activeShipment?.shipment?.numberOfHorses || 1} Horse(s)
              </AppText>
            </View>
            <View style={styles.metricChip}>
              <AppIcon
                name={'ShieldCheck'}
                size={14}
                color={COLORS.greenActive}
              />
              <AppText style={styles.metricChipText}>Insured Load</AppText>
            </View>
          </View>
        </View>

        {/* Vertical Route Timeline */}
        <View style={styles.timelineContainer}>
          {/* Pickup Node */}
          <View style={styles.stopCard}>
            <View
              style={[styles.nodeIconCircle, { backgroundColor: '#10B981' }]}
            >
              <AppIcon name={'MapPin'} size={16} color={COLORS.white} />
            </View>
            <View style={styles.stopDetails}>
              <AppText style={styles.stopLabel}>PICKUP LOCATION</AppText>
              <AppText style={styles.stopLocation}>{pickupLoc}</AppText>
              <View style={styles.stopMetaRow}>
                <AppIcon
                  name={'Calendar'}
                  size={13}
                  color={COLORS.textSecondary}
                />
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
            <View
              style={[styles.nodeIconCircle, { backgroundColor: '#EF4444' }]}
            >
              <AppIcon name={'MapPin'} size={16} color={COLORS.white} />
            </View>
            <View style={styles.stopDetails}>
              <AppText style={styles.stopLabel}>DROP-OFF LOCATION</AppText>
              <AppText style={styles.stopLocation}>{deliveryLoc}</AppText>
              <View style={styles.stopMetaRow}>
                <AppIcon
                  name={'Clock'}
                  size={13}
                  color={COLORS.textSecondary}
                />
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
