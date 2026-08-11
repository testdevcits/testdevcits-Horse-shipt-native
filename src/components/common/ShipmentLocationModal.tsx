import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
  Platform,
} from 'react-native';
import {
  MapPin,
  X,
  Copy,
  Navigation,
  CheckCircle2,
  Clock,
  Lock,
  MessageSquare,
  Package,
  ArrowDown,
  Share2,
  ExternalLink,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { COLORS, FONT_SIZE, FONTS, ICON_SIZE, RADIUS, SPACING } from '../../constants';
import AppText from './AppText';

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
  // Extract values with fallbacks
  const pickup = propPickup || shipment?.pickupLocation || 'Pickup location not specified';
  const delivery = propDelivery || shipment?.deliveryLocation || 'Delivery location not specified';
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

  // Copy or Share Location text
  const handleCopyLocation = async (type: 'pickup' | 'delivery' | 'code') => {
    let textToShare = '';
    let label = '';

    if (type === 'pickup') {
      textToShare = pickup;
      label = 'Pickup address';
    } else if (type === 'delivery') {
      textToShare = delivery;
      label = 'Delivery address';
    } else {
      textToShare = code;
      label = 'Shipment Code';
    }

    try {
      await Share.share({
        message: textToShare,
        title: label,
      });
      Toast.show({
        type: 'success',
        text1: 'Copied / Shared',
        text2: `${label} ready to paste or share.`,
      });
    } catch (error) {
      console.log('Share Error:', error);
    }
  };

  // Open External Maps (Google Maps / Apple Maps)
  const handleOpenExternalMaps = () => {
    if (onOpenMapModal) {
      onClose();
      onOpenMapModal();
      return;
    }

    const query = encodeURIComponent(`${pickup} to ${delivery}`);
    const mapUrl = Platform.select({
      ios: `maps://?q=${query}`,
      android: `geo:0,0?q=${encodeURIComponent(delivery)}`,
    }) || `https://www.google.com/maps/search/?api=1&query=${query}`;

    Linking.canOpenURL(mapUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(mapUrl);
        } else {
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery)}`);
        }
      })
      .catch(err => console.error('An error occurred opening map', err));
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.cardContainer}
          onPress={e => e.stopPropagation()}
        >
          {/* Header Bar Indicator */}
          <View style={styles.dragIndicator} />

          {/* Top Bar with Title & Close */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Package size={20} color={COLORS.primary} strokeWidth={2.2} />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.xs }}>
                <AppText style={styles.headerTitle}>Shipment Details</AppText>
                <TouchableOpacity
                  style={styles.codeRow}
                  activeOpacity={0.7}
                  onPress={() => handleCopyLocation('code')}
                >
                  <AppText style={styles.headerSubtitle}>{code}</AppText>
                  <Copy size={12} color={COLORS.textLight} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={ICON_SIZE.md} color={COLORS.grey600} />
            </TouchableOpacity>
          </View>

          {/* Status & Meta Info Row */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusStyle.bg, borderColor: statusStyle.borderColor },
              ]}
            >
              <View style={[styles.statusDot, { backgroundColor: statusStyle.color }]} />
              <AppText style={[styles.statusText, { color: statusStyle.color }]}>
                {statusStyle.label}
              </AppText>
            </View>

            {isChatLocked ? (
              <View style={styles.lockedBadge}>
                <Lock size={12} color={COLORS.grey600} style={{ marginRight: 4 }} />
                <AppText style={styles.lockedBadgeText}>Chat Locked</AppText>
              </View>
            ) : (
              <View style={styles.activeBadge}>
                <MessageSquare size={12} color={COLORS.greenSuccess} style={{ marginRight: 4 }} />
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
                  <View style={[styles.pinBadge, { backgroundColor: '#E6F7F0' }]}>
                    <MapPin size={16} color={COLORS.greenPrimary} strokeWidth={2.5} />
                  </View>
                  <AppText style={[styles.locationTag, { color: COLORS.greenPrimary }]}>
                    PICKUP LOCATION
                  </AppText>
                  <TouchableOpacity
                    style={styles.copyIconButton}
                    onPress={() => handleCopyLocation('pickup')}
                    activeOpacity={0.7}
                  >
                    <Copy size={14} color={COLORS.grey500} />
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
                    <ArrowDown size={14} color={COLORS.primary} strokeWidth={2.5} />
                  </View>
                  <View style={styles.verticalLine} />
                </View>
              </View>

              {/* DELIVERY SECTION */}
              <View style={styles.locationSection}>
                <View style={styles.locationHeader}>
                  <View style={[styles.pinBadge, { backgroundColor: COLORS.redLightBg }]}>
                    <MapPin size={16} color={COLORS.redPrimary} strokeWidth={2.5} />
                  </View>
                  <AppText style={[styles.locationTag, { color: COLORS.redPrimary }]}>
                    DELIVERY LOCATION
                  </AppText>
                  <TouchableOpacity
                    style={styles.copyIconButton}
                    onPress={() => handleCopyLocation('delivery')}
                    activeOpacity={0.7}
                  >
                    <Copy size={14} color={COLORS.grey500} />
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
            >
              <Navigation size={18} color={COLORS.primary} strokeWidth={2.2} style={{ marginRight: 8 }} />
              <AppText style={styles.mapButtonText}>Get Directions</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closePrimaryBtn}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <AppText style={styles.closePrimaryText}>Close</AppText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl || 24,
    borderTopRightRadius: RADIUS.xxl || 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
    maxHeight: '85%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  dragIndicator: {
    width: 38,
    height: 4,
    backgroundColor: COLORS.grey300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#DCCEB2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Status Section
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round || 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs2 || 4,
    borderRadius: RADIUS.sm,
  },
  lockedBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F0',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs2 || 4,
    borderRadius: RADIUS.sm,
  },
  activeBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.greenPrimary,
  },

  // Scroll Content
  scrollContent: {
    marginBottom: SPACING.md,
  },
  routeBox: {
    backgroundColor: COLORS.slate50 || '#F8FAFC',
    borderRadius: RADIUS.lg || 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.slate200 || '#E2E8F0',
  },

  // Location Sections
  locationSection: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  pinBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  locationTag: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    letterSpacing: 0.8,
    flex: 1,
  },
  copyIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  copyBtnText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
    marginLeft: 4,
  },
  addressBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  addressText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  // Connector Line
  connectorRow: {
    paddingVertical: SPACING.xs,
    alignItems: 'flex-start',
    paddingLeft: 12,
  },
  verticalLineContainer: {
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.goldBorder || COLORS.primaryLight,
  },
  connectorIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#DCCEB2',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  mapButton: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButtonText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  closePrimaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closePrimaryText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default ShipmentLocationModal;
