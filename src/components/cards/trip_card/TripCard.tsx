import React, { memo, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../../constants';
import AppText from '../../common/AppText';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.tripcard';
import { Horse } from '../../../types/driver';
import { horsePlaceholderImage } from '../../../config/constants';

const HorseCardAvatar: React.FC<{ url?: string | null }> = ({ url }) => {
  const [imageError, setImageError] = useState(false);
  const imageUri = url && !imageError ? url : horsePlaceholderImage;

  return (
    <Image
      source={{ uri: imageUri }}
      style={styles.horseAvatar}
      onError={() => setImageError(true)}
    />
  );
};

export interface TripCardProps {
  item: any;
  onCompletePress?: (id: string) => void;
  onCardPress?: (item: any) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const TripCard: React.FC<TripCardProps> = ({
  item,
  onCompletePress,
  onCardPress,
  containerStyle,
}) => {
  const shipmentData = item?.shipment || item;
  const pickupLoc =
    shipmentData?.pickupLocation || 'Pickup location unavailable';
  const deliveryLoc =
    shipmentData?.deliveryLocation || 'Delivery location unavailable';
  const shipmentId = item?._id || shipmentData?._id;
  const shortId = shipmentData?.shipmentCode
    ? `#${shipmentData.shipmentCode}`
    : shipmentId
    ? `#${shipmentId.slice(0, 8)}`
    : `#MANIFEST`;

  const firstHorse: Horse | undefined = shipmentData?.horses?.[0];
  const horsePhotoUrl = firstHorse?.photo?.url;

  const vehicleNumber = item?.vehicle?.vehicleNumber || 'NA';
  const priceDisplay =
    item?.totalPrice != null
      ? `$${item.totalPrice.toLocaleString()}`
      : shipmentData?.totalPrice != null
      ? `$${shipmentData.totalPrice.toLocaleString()}`
      : '$0';
  const paymentStatusText = item?.paymentStatus
    ? item.paymentStatus.toUpperCase()
    : shipmentData?.paymentStatus
    ? shipmentData.paymentStatus.toUpperCase()
    : 'NA';
  const notesText =
    item?.notes?.trim() ||
    firstHorse?.notes?.trim() ||
    shipmentData?.notes?.trim();

  const tripStatusRaw = item?.tripStatus || item?.status || shipmentData?.tripStatus || shipmentData?.status || 'unknown';
  const statusLower = tripStatusRaw.toString().toLowerCase().replace(/_/g, '');

  const isTransit =
    statusLower === 'intransit' ||
    statusLower === 'started' ||
    statusLower === 'active' ||
    statusLower === 'intrip';
  const isCompleted = statusLower === 'completed' || statusLower === 'delivered';
  const isPending =
    statusLower === 'pending' ||
    statusLower === 'notstarted' ||
    statusLower === 'assigned' ||
    statusLower === 'upcoming';

  const getStatusBadgeStyle = () => {
    if (isTransit) return styles.statusChipTransit;
    if (isCompleted) return styles.statusChipCompleted;
    if (isPending) return styles.statusChipPending;
    return null;
  };

  const getStatusDotStyle = () => {
    if (isTransit) return styles.statusDotTransit;
    if (isCompleted) return styles.statusDotCompleted;
    if (isPending) return styles.statusDotPending;
    return null;
  };

  const getStatusTextStyle = () => {
    if (isTransit) return styles.statusChipTextTransit;
    if (isCompleted) return styles.statusChipTextCompleted;
    if (isPending) return styles.statusChipTextPending;
    return null;
  };

  const displayStatus = isTransit
    ? 'In Transit'
    : isCompleted
    ? 'Completed'
    : isPending
    ? 'Pending'
    : tripStatusRaw;

  return (
    <TouchableOpacity
      style={[styles.card, containerStyle]}
      activeOpacity={0.85}
      onPress={() => onCardPress?.(item)}
    >
      {/* Header Row: ID, Status, Price */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <AppText style={styles.manifestTag}>{shortId}</AppText>
          <View style={[styles.statusChip, getStatusBadgeStyle()]}>
            <View style={[styles.statusDot, getStatusDotStyle()]} />
            <AppText style={[styles.statusChipText, getStatusTextStyle()]}>
              {displayStatus}
            </AppText>
          </View>
        </View>

        <View style={styles.priceBadge}>
          <AppText style={styles.priceAmountText}>{priceDisplay}</AppText>
          <AppText style={styles.priceStatusText}>{paymentStatusText}</AppText>
        </View>
      </View>

      {/* Route Visualizer */}
      <View style={styles.routeContainer}>
        {/* Origin */}
        <View style={styles.routeRow}>
          <View style={styles.routeIconBox}>
            <View style={styles.routeDotOrigin} />
          </View>
          <View style={styles.routeContent}>
            <AppText style={styles.routeLabel} numberOfLines={1}>
              {pickupLoc}
            </AppText>
            {shipmentData?.pickupCoords && (
              <AppText style={styles.routeCoords}>
                {shipmentData.pickupCoords.latitude?.toFixed(3)}° N,{' '}
                {shipmentData.pickupCoords.longitude?.toFixed(3)}° E
              </AppText>
            )}
          </View>
        </View>

        {/* Vertical Line */}
        <View style={styles.routeRow}>
          <View style={styles.routeIconBox}>
            <View style={styles.routeLineVertical} />
          </View>
        </View>

        {/* Destination */}
        <View style={styles.routeRow}>
          <View style={styles.routeIconBox}>
            <AppIcon name="MapPin" size={14} color={COLORS.primary} />
          </View>
          <View style={styles.routeContent}>
            <AppText style={styles.routeLabel} numberOfLines={1}>
              {deliveryLoc}
            </AppText>
            {shipmentData?.deliveryCoords && (
              <AppText style={styles.routeCoords}>
                {shipmentData.deliveryCoords.latitude?.toFixed(3)}° N,{' '}
                {shipmentData.deliveryCoords.longitude?.toFixed(3)}° E
              </AppText>
            )}
          </View>
        </View>
      </View>

      {/* Equine Section */}
      {firstHorse && (
        <View style={styles.horseSection}>
          <HorseCardAvatar url={horsePhotoUrl} />
          <View style={styles.horseDetails}>
            <View style={styles.horseHeaderRow}>
              <AppText style={styles.horseName}>
                {firstHorse.registeredName || 'Horse Manifest'}
              </AppText>
              {firstHorse.requestedStallSize && (
                <View style={styles.stallBadge}>
                  <AppText style={styles.stallBadgeText}>
                    {firstHorse.requestedStallSize}
                  </AppText>
                </View>
              )}
            </View>
            <AppText style={styles.horseSubtext}>
              {[
                firstHorse.breed,
                firstHorse.sex,
                firstHorse.age ? `${firstHorse.age}yo` : null,
                firstHorse.barnName ? `Barn: ${firstHorse.barnName}` : null,
              ]
                .filter(Boolean)
                .join(' • ')}
            </AppText>
          </View>
        </View>
      )}

      {/* Vehicle & Transport Type Footer */}
      <View style={styles.cardFooterRow}>
        <View style={styles.vehicleChip}>
          <AppIcon name="Truck" size={14} color={COLORS.slate600} />
          <AppText style={styles.vehicleText}>
            Rig #{vehicleNumber} • {item?.stallsRequired || shipmentData?.stallsRequired || 0} Stalls
          </AppText>
        </View>
      </View>

      {/* Special Care Notes Banner */}
      {notesText ? (
        <View style={styles.notesBanner}>
          <AppIcon name="Info" size={14} color={COLORS.amberPrimary} />
          <AppText style={styles.notesText} numberOfLines={2}>
            {notesText}
          </AppText>
        </View>
      ) : null}

      {/* Active Trip Button */}
      {isTransit && onCompletePress ? (
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={() => {
            onCompletePress(shipmentId || item?._id);
          }}
        >
          <AppText style={styles.actionButtonText}>
            Complete Delivery (OTP)
          </AppText>
          <AppIcon name="ChevronRight" size={16} color={COLORS.white} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

export default memo(TripCard);
