import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../all_Shipments/styles.postload';
import { getItemTripStatus } from './MyShipmentsScreen';

interface ShipperShipmentCardItemProps {
  item: any;
  onOpenContract: (item: any) => void;
  onTrackShipment: (item: any) => void;
  onReviewPress: (item: any) => void;
}

const ShipperShipmentCardItem: React.FC<ShipperShipmentCardItemProps> = ({
  item,
  onOpenContract,
  onTrackShipment,
  onReviewPress,
}) => {
  const shipment = item?.shipment || item;
  const code = item?.shipmentCode || shipment.shipmentCode || 'Not available';
  const pickupLoc =
    item?.pickupLocation ||
    shipment.pickupLocation ||
    'Pickup location unavailable';
  const deliveryLoc =
    item?.deliveryLocation ||
    shipment.deliveryLocation ||
    'Delivery location unavailable';
  const horsesCount = shipment.numberOfHorses || shipment.horses?.length || 0;

  const itemStatus = getItemTripStatus(item);
  const paymentStatusRaw = (item?.paymentStatus || 'pending').toLowerCase();
  const priceText = item?.totalPrice ? `$${item?.totalPrice}` : '$0';
  const paymentMethodText = item?.paymentMethod || 'card';
  const paymentDueText = item?.paymentDue
    ? `due on ${item?.paymentDue}`
    : 'due on delivery';

  const isPaid = paymentStatusRaw === 'paid';

  const getBadgeStyle = () => {
    switch (itemStatus) {
      case 'in_transit':
        return {
          bg: COLORS.skyLightBg,
          border: COLORS.skyBorder,
          text: COLORS.skyPrimary,
          label: 'IN TRANSIT',
          icon: <AppIcon name="Truck" size={12} color={COLORS.skyPrimary} />,
        };
      case 'completed':
        return {
          bg: COLORS.emeraldLightBg,
          border: COLORS.emeraldBorder,
          text: COLORS.emeraldPrimary,
          label: 'COMPLETED',
          icon: (
            <AppIcon name="Check" size={12} color={COLORS.emeraldPrimary} />
          ),
        };
      case 'cancelled':
        return {
          bg: COLORS.redLightBg,
          border: COLORS.redBorder,
          text: COLORS.redPrimary,
          label: 'CANCELLED',
          icon: (
            <AppIcon name="AlertCircle" size={12} color={COLORS.redPrimary} />
          ),
        };
      case 'upcoming':
      default:
        return {
          bg: COLORS.amberLightBg,
          border: COLORS.amberBorder,
          text: COLORS.amberWarning,
          label: 'UPCOMING',
          icon: <AppIcon name="Clock" size={12} color={COLORS.amberWarning} />,
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <View style={styles.myShipmentCard}>
      {/* Header Row: Code & Badges */}
      <View style={styles.myHeaderRow}>
        <View style={styles.codeBadge}>
          <AppIcon name="Package" size={12} color={COLORS.textSecondary} />
          <AppText style={styles.myCodeText}>#{code}</AppText>
        </View>
      </View>
      <View style={styles.myBadgesRow}>
        {/* Trip Status Badge */}
        <View
          style={[
            styles.myBadgePill,
            { backgroundColor: badge.bg, borderColor: badge.border },
          ]}
        >
          {badge.icon}
          <AppText style={[styles.myBadgePillText, { color: badge.text }]}>
            {badge.label}
          </AppText>
        </View>

        {/* Payment Badge */}
        <View
          style={[
            styles.myBadgePill,
            isPaid
              ? {
                  backgroundColor: COLORS.emeraldLightBg,
                  borderColor: COLORS.emeraldBorder,
                }
              : {
                  backgroundColor: COLORS.slate50,
                  borderColor: COLORS.slate300,
                },
          ]}
        >
          <AppIcon
            name="CreditCard"
            size={11}
            color={isPaid ? COLORS.emeraldPrimary : COLORS.textSecondary}
          />
          <AppText
            style={[
              styles.myBadgePillText,
              isPaid
                ? { color: COLORS.emeraldPrimary }
                : { color: COLORS.textSecondary },
            ]}
          >
            {paymentStatusRaw.toUpperCase()}
          </AppText>
        </View>
      </View>
      {/* Route Graphic Row */}
      <View style={styles.routeGraphicContainer}>
        {/* Pickup Node */}
        <View style={styles.routeLocCol}>
          <View style={styles.locHeaderRow}>
            <View
              style={[styles.locDot, { backgroundColor: COLORS.amberPrimary }]}
            />
            <AppText style={styles.routeLocLabel}>PICKUP</AppText>
          </View>
          <AppText style={styles.routeAddressText} numberOfLines={2}>
            {pickupLoc}
          </AppText>
        </View>

        {/* Track Line with Arrow */}
        <View style={styles.trackMiddle}>
          <View style={styles.trackLine} />
          <View style={styles.trackTruckBox}>
            <AppIcon name="ArrowRight" size={12} color={COLORS.amberPrimary} />
          </View>
        </View>

        {/* Delivery Node */}
        <View style={styles.routeLocCol}>
          <View style={styles.locHeaderRow}>
            <View
              style={[styles.locDot, { backgroundColor: COLORS.success }]}
            />
            <AppText style={styles.routeLocLabel}>DELIVERY</AppText>
          </View>
          <AppText style={styles.routeAddressText} numberOfLines={2}>
            {deliveryLoc}
          </AppText>
        </View>
      </View>

      {/* Info Meta Grid */}
      <View style={styles.metaInfoContainer}>
        <View style={styles.metaItem}>
          <AppText style={styles.metaLabel}>Horses</AppText>
          <AppText style={styles.metaValue}>
            👤 {horsesCount} {horsesCount === 1 ? 'Horse' : 'Horses'}
          </AppText>
        </View>

        <View style={styles.metaDivider} />

        <View style={styles.metaItem}>
          <AppText style={styles.metaLabel}>Total Price</AppText>
          <AppText style={styles.priceValue}>{priceText}</AppText>
        </View>

        <View style={styles.metaDivider} />

        <View style={styles.metaItem}>
          <AppText style={styles.metaLabel}>Payment</AppText>
          <AppText style={styles.metaValue} numberOfLines={1}>
            {paymentMethodText} • {paymentDueText}
          </AppText>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.myActionsRow}>
        <TouchableOpacity
          style={styles.viewContractBtn}
          onPress={() => onOpenContract(item)}
          activeOpacity={0.8}
        >
          <AppIcon name="FileText" size={14} color={COLORS.saddleBrown} />
          <AppText style={styles.viewContractBtnText}>View Contract</AppText>
        </TouchableOpacity>
        {itemStatus === 'completed' || item?.tripStatus === 'completed' ? (
          <TouchableOpacity
            style={styles.reviewCustomerBtn}
            onPress={() => onReviewPress(item)}
            activeOpacity={0.8}
          >
            <AppIcon
              name="Star"
              size={14}
              color={COLORS.white}
              fill={COLORS.white}
            />
            <AppText style={styles.reviewCustomerBtnText}>
              Review Customer
            </AppText>
          </TouchableOpacity>
        ) : (
          paymentStatusRaw !== 'pending' && (
            <TouchableOpacity
              style={styles.trackShipmentBtn}
              onPress={() => onTrackShipment(item)}
              activeOpacity={0.8}
            >
              <AppIcon name="Navigation" size={14} color={COLORS.white} />
              <AppText style={styles.trackShipmentBtnText}>
                Track Shipment
              </AppText>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

export default memo(ShipperShipmentCardItem);
