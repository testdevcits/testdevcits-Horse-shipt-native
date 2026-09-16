import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { COLORS, FONT_SIZE, FONTS, SPACING } from '../../../constants';
import AppText from '../../common/AppText';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.tripcard';

interface TripCardProps {
  item: any;
  onCompletePress?: (id: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const TripCard: React.FC<TripCardProps> = ({
  item,
  onCompletePress,
  containerStyle,
}) => {
  const shipmentData = item?.shipment || {};
  const status = item?.tripStatus;
  const isTransit = status === 'inTransit' || status === 'started';
  const isCompleted = status === 'completed' || status === 'delivered';

  return (
    <View style={[styles.card, containerStyle]}>
      {/* Route Header & Badging */}
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleRow}>
          <AppText style={styles.routeHeader}>DISPATCH MANIFEST</AppText>
          {shipmentData?.shipmentCode && (
            <AppText style={styles.shipmentCodeTag}>
              #{shipmentData?.shipmentCode}
            </AppText>
          )}
        </View>

        <View
          style={[
            styles.statusBadge,
            isTransit
              ? styles.statusBadgeActive
              : isCompleted
              ? styles.statusBadgeCompleted
              : styles.statusBadgePending,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isTransit
                ? styles.activeDot
                : isCompleted
                ? styles.completedDot
                : styles.pendingDot,
            ]}
          />
          <AppText
            style={[
              styles.statusBadgeText,
              isTransit
                ? styles.statusActiveText
                : isCompleted
                ? styles.statusCompletedText
                : styles.statusPendingText,
            ]}
          >
            {isTransit
              ? 'In Transit'
              : isCompleted
              ? 'Completed'
              : status || 'Pending'}
          </AppText>
        </View>
      </View>

      {/* Route Details Flow */}
      <View style={styles.routeRow}>
        <View style={styles.locationWrapper}>
          <View style={styles.nodeDotGreen} />
          <AppText style={styles.locationText} numberOfLines={2}>
            {shipmentData?.pickupLocation || 'Not Available'}
          </AppText>
        </View>

        <AppIcon
          name="ArrowRight"
          size={16}
          color={COLORS.primary}
          style={styles.arrowIcon}
        />

        <View style={styles.locationWrapper}>
          <View style={styles.nodeDotRed} />
          <AppText style={styles.locationText} numberOfLines={2}>
            {shipmentData?.deliveryLocation || 'Not Available'}
          </AppText>
        </View>
      </View>

      {/* Shipment Specs Grid */}
      <View style={styles.footerRow}>
        <View style={styles.infoBadge}>
          <AppIcon name="Truck" size={14} color={COLORS.primary} />
          <AppText style={styles.infoText}>
            {shipmentData?.numberOfHorses || 1}{' '}
            {shipmentData?.numberOfHorses === 1 ? 'Horse' : 'Horses'}
          </AppText>
        </View>

        <View style={styles.infoBadge}>
          <AppIcon name="ShieldCheck" size={14} color={COLORS.greenActive} />
          <AppText style={styles.infoText}>Verified Route</AppText>
        </View>
      </View>

      {/* Primary Contextual Action Button */}
      {isTransit && onCompletePress && (
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={() => onCompletePress(item?._id)}
        >
          <AppText style={styles.actionButtonText}>
            Complete Delivery (OTP)
          </AppText>
          <AppIcon name="ChevronRight" size={16} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(TripCard);
