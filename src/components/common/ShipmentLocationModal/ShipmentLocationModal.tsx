import React, { memo } from 'react';
import {
  Modal,
  
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COLORS,
  
  ICON_SIZE,
   
  SPACING,
} from '../../../constants';
import AppText from '../AppText';
import AppIcon from '../../app_icon/AppIcon';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import styles from './ShipmentLocationModal.styles';

export interface ShipmentData {
  _id?: string;
  shipmentCode?: string;
  status?: string;
  isChatLocked?: boolean;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupDateRange?: { start?: string; end?: string };
  shipperName?: string;
  [key: string]: any;
}

export interface ShipmentLocationModalProps {
  isVisible: boolean;
  onClose: () => void;
  shipment?: ShipmentData | null;
  pickupLocation?: string;
  deliveryLocation?: string;
  shipmentCode?: string;
  status?: string;
  onOpenMapModal?: () => void;
}

const ShipmentLocationModal: React.FC<ShipmentLocationModalProps> = ({
  isVisible,
  onClose,
  shipment,
  pickupLocation: propPickup,
  deliveryLocation: propDelivery,
  shipmentCode: propCode,
  status: propStatus,
  onOpenMapModal,
}) => {
  const insets = useSafeAreaInsets();

  // Extract values with fallbacks
  const pickup =
    propPickup || shipment?.pickupLocation || 'Pickup location not specified';
  const delivery =
    propDelivery ||
    shipment?.deliveryLocation ||
    'Delivery location not specified';
  const code = propCode || shipment?.shipmentCode || 'N/A';
  const status = (propStatus || shipment?.status || 'in_transit').toLowerCase();
  const isChatLocked = shipment?.isChatLocked || status === 'completed';

  // Format Status Badge
  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return {
          label: 'COMPLETED',
          bg: COLORS.greenBadgeBg,
          color: COLORS.greenBadgeText,
          borderColor: COLORS.greenBadgeBorder,
        };
      case 'in_transit':
      case 'in_progress':
        return {
          label: 'IN TRANSIT',
          bg: COLORS.blueLightBg,
          color: COLORS.bluePrimary,
          borderColor: COLORS.blueBorder,
        };
      case 'pending':
        return {
          label: 'PENDING',
          bg: COLORS.amberLightBg,
          color: COLORS.amberPrimary,
          borderColor: COLORS.amberBorder,
        };
      case 'cancelled':
        return {
          label: 'CANCELLED',
          bg: COLORS.redLightBg,
          color: COLORS.redPrimary,
          borderColor: COLORS.redBorder,
        };
      default:
        return {
          label: status.toUpperCase().replace('_', ' '),
          bg: COLORS.goldLightBg,
          color: COLORS.goldPrimary,
          borderColor: COLORS.goldBorder,
        };
    }
  };

  const statusStyle = getStatusBadge();

  // Copy Location or Code to Clipboard
  const handleCopyLocation = (type: 'pickup' | 'delivery' | 'code') => {
    let textToCopy = '';
    let label = '';

    if (type === 'pickup') {
      textToCopy = pickup;
      label = 'Pickup address';
    } else if (type === 'delivery') {
      textToCopy = delivery;
      label = 'Delivery address';
    } else {
      textToCopy = code;
      label = 'Shipment code';
    }

    try {
      Clipboard.setString(textToCopy);
      showSuccessToast('Copied to Clipboard', `${label} copied successfully.`);
    } catch (error) {
      console.log('Clipboard Copy Error:', error);
    }
  };

  // Open External Maps (Google Maps / Apple Maps)
  const handleOpenExternalMaps = () => {
    if (onOpenMapModal) {
      onClose();
      onOpenMapModal();
      return;
    }

    if (
      !pickup ||
      pickup.includes('not specified') ||
      !delivery ||
      delivery.includes('not specified')
    ) {
      showErrorToast(
        'Invalid Location',
        'Complete pickup and delivery locations are required for navigation.',
      );
      return;
    }

    const encodedPickup = encodeURIComponent(pickup);
    const encodedDelivery = encodeURIComponent(delivery);

    const mapUrl =
      Platform.select({
        ios: `https://maps.apple.com/?saddr=${encodedPickup}&daddr=${encodedDelivery}&dirflg=d`,
        android: `https://www.google.com/maps/dir/?api=1&origin=${encodedPickup}&destination=${encodedDelivery}&travelmode=driving`,
      }) ||
      `https://www.google.com/maps/dir/?api=1&origin=${encodedPickup}&destination=${encodedDelivery}`;

    Linking.openURL(mapUrl).catch(err => {
      console.error('An error occurred opening map', err);

      showErrorToast('Unable to Open Maps', 'Could not open map application.');
    });
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close overlay"
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.cardContainer,
            { paddingBottom: Math.max(insets.bottom, SPACING.lg) },
          ]}
          onPress={e => e.stopPropagation()}
        >
          {/* Header Bar Indicator */}
          <View style={styles.dragIndicator} />

          {/* Top Bar with Title & Close */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <AppIcon
                  name={'Package'}
                  size={20}
                  color={COLORS.primary}
                  strokeWidth={2.2}
                />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.xs }}>
                <AppText style={styles.headerTitle}>Shipment Details</AppText>
                <TouchableOpacity
                  style={styles.codeRow}
                  activeOpacity={0.7}
                  onPress={() => handleCopyLocation('code')}
                  accessibilityRole="button"
                  accessibilityLabel={`Shipment code ${code}`}
                  accessibilityHint="Tap to copy shipment code to clipboard"
                >
                  <AppText style={styles.headerSubtitle}>{code}</AppText>
                  <AppIcon
                    name={'Copy'}
                    size={12}
                    color={COLORS.textLight}
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <AppIcon name={'X'} size={ICON_SIZE.md} color={COLORS.grey600} />
            </TouchableOpacity>
          </View>

          {/* Status & Meta Info Row */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusStyle.bg,
                  borderColor: statusStyle.borderColor,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusStyle.color },
                ]}
              />
              <AppText
                style={[styles.statusText, { color: statusStyle.color }]}
              >
                {statusStyle.label}
              </AppText>
            </View>

            {isChatLocked ? (
              <View style={styles.lockedBadge}>
                <AppIcon
                  name={'Lock'}
                  size={12}
                  color={COLORS.grey600}
                  style={{ marginRight: 4 }}
                />
                <AppText style={styles.lockedBadgeText}>Chat Locked</AppText>
              </View>
            ) : (
              <View style={styles.activeBadge}>
                <AppIcon
                  name={'MessageSquare'}
                  size={12}
                  color={COLORS.greenSuccess}
                  style={{ marginRight: 4 }}
                />
                <AppText style={styles.activeBadgeText}>Chat Active</AppText>
              </View>
            )}
          </View>

          {/* Scrollable Content for Addresses */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Route Timeline Container */}
            <View style={styles.routeBox}>
              {/* PICKUP SECTION */}
              <View style={styles.locationSection}>
                <View style={styles.locationHeader}>
                  <View
                    style={[
                      styles.pinBadge,
                      { backgroundColor: COLORS.mintLightBg },
                    ]}
                  >
                    <AppIcon
                      name={'MapPin'}
                      size={16}
                      color={COLORS.greenPrimary}
                      strokeWidth={2.5}
                    />
                  </View>
                  <AppText
                    style={[styles.locationTag, { color: COLORS.greenPrimary }]}
                  >
                    PICKUP LOCATION
                  </AppText>
                  <TouchableOpacity
                    style={styles.copyIconButton}
                    onPress={() => handleCopyLocation('pickup')}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Copy pickup location"
                    accessibilityHint="Copies pickup address to clipboard"
                  >
                    <AppIcon name={'Copy'} size={14} color={COLORS.grey500} />
                    <AppText style={styles.copyBtnText}>Copy</AppText>
                  </TouchableOpacity>
                </View>

                <View style={styles.addressBox}>
                  <AppText style={styles.addressText}>{pickup}</AppText>
                </View>
              </View>

              {/* VERTICAL CONNECTOR LINE */}
              <View style={styles.connectorRow}>
                <View style={styles.verticalLineContainer}>
                  <View style={styles.verticalLine} />
                  <View style={styles.connectorIconCircle}>
                    <AppIcon
                      name={'ArrowDown'}
                      size={14}
                      color={COLORS.primary}
                      strokeWidth={2.5}
                    />
                  </View>
                  <View style={styles.verticalLine} />
                </View>
              </View>

              {/* DELIVERY SECTION */}
              <View style={styles.locationSection}>
                <View style={styles.locationHeader}>
                  <View
                    style={[
                      styles.pinBadge,
                      { backgroundColor: COLORS.redLightBg },
                    ]}
                  >
                    <AppIcon
                      name={'MapPin'}
                      size={16}
                      color={COLORS.redPrimary}
                      strokeWidth={2.5}
                    />
                  </View>
                  <AppText
                    style={[styles.locationTag, { color: COLORS.redPrimary }]}
                  >
                    DELIVERY LOCATION
                  </AppText>
                  <TouchableOpacity
                    style={styles.copyIconButton}
                    onPress={() => handleCopyLocation('delivery')}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Copy delivery location"
                    accessibilityHint="Copies delivery address to clipboard"
                  >
                    <AppIcon name={'Copy'} size={14} color={COLORS.grey500} />
                    <AppText style={styles.copyBtnText}>Copy</AppText>
                  </TouchableOpacity>
                </View>

                <View style={styles.addressBox}>
                  <AppText style={styles.addressText}>{delivery}</AppText>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={handleOpenExternalMaps}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Get Directions"
              accessibilityHint="Opens external map application for directions"
            >
              <AppIcon
                name={'Navigation'}
                size={18}
                color={COLORS.primary}
                strokeWidth={2.2}
                style={{ marginRight: 8 }}
              />
              <AppText style={styles.mapButtonText}>Get Directions</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closePrimaryBtn}
              onPress={onClose}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <AppText style={styles.closePrimaryText}>Close</AppText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default memo(ShipmentLocationModal);
