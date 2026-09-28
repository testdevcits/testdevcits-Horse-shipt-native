import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import styles from './ReviewStepstyles';

interface RouteOverviewCardProps {
  pickupLocation?: string;
  pickupStartDate?: any;
  pickupEndDate?: any;
  deliveryLocation?: string;
  deliveryStartDate?: any;
  deliveryEndDate?: any;
  onEditSection: (stepIndex: number) => void;
  formatDateDisplay: (dateVal: any) => string;
}

const RouteOverviewCard: React.FC<RouteOverviewCardProps> = ({
  pickupLocation,
  pickupStartDate,
  pickupEndDate,
  deliveryLocation,
  deliveryStartDate,
  deliveryEndDate,
  onEditSection,
  formatDateDisplay,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.iconCircle}>
            <AppIcon name={'MapPin'} size={16} color={COLORS.primary} />
          </View>
          <AppText style={styles.cardTitle}>ROUTE & SCHEDULE</AppText>
        </View>
        <TouchableOpacity
          style={styles.miniEditBtn}
          onPress={() => onEditSection(0)}
          activeOpacity={0.8}
        >
          <AppIcon name={'Edit3'} size={13} color={COLORS.primary} />
          <AppText style={styles.miniEditText}>Edit Route</AppText>
        </TouchableOpacity>
      </View>

      {/* VISUAL ROUTE TIMELINE */}
      <View style={styles.routeTimeline}>
        {/* PICKUP NODE */}
        <View style={styles.routeNode}>
          <View style={styles.pickupDotContainer}>
            <View style={styles.pickupDot} />
          </View>
          <View style={styles.routeTextContent}>
            <AppText style={styles.routeNodeLabel}>PICKUP LOCATION</AppText>
            <AppText style={styles.routeAddressText}>
              {pickupLocation || 'Pickup location not specified'}
            </AppText>
            <View style={styles.routeDateBadge}>
              <AppIcon name={'Calendar'} size={13} color={COLORS.primary} />
              <AppText style={styles.routeDateText}>
                {formatDateDisplay(pickupStartDate)} — {formatDateDisplay(pickupEndDate)}
              </AppText>
            </View>
          </View>
        </View>

        {/* CONNECTING LINE */}
        <View style={styles.routeLineContainer}>
          <View style={styles.routeLine} />
        </View>

        {/* DELIVERY NODE */}
        <View style={styles.routeNode}>
          <View style={styles.deliveryDotContainer}>
            <View style={styles.deliveryDot} />
          </View>
          <View style={styles.routeTextContent}>
            <AppText style={styles.routeNodeLabel}>
              DELIVERY DESTINATION
            </AppText>
            <AppText style={styles.routeAddressText}>
              {deliveryLocation || 'Delivery location not specified'}
            </AppText>
            <View style={styles.routeDateBadge}>
              <AppIcon name={'Calendar'} size={13} color={COLORS.primary} />
              <AppText style={styles.routeDateText}>
                {formatDateDisplay(deliveryStartDate)} — {formatDateDisplay(deliveryEndDate)}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(RouteOverviewCard);