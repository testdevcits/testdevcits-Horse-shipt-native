import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { MapPin, Calendar, ArrowRight, Compass } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, ICON_SIZE, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

// Import your custom constants (verify relative paths for your folder structure)
 

interface TripCardProps {
  item: any;
  onCompletePress?: (id: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

  const TripCard: React.FC<TripCardProps> = ({ item, onCompletePress, containerStyle }) => {
  const shipmentData = item?.shipment || {};
  const status = item?.tripStatus;

  return (
    <View style={[styles.card, containerStyle]}>
      {/* Route Header & Badging */}
      <View style={styles.cardHeader}>
        <AppText style={styles.routeHeader}>ROUTE</AppText>
        {status && (
          <View style={[
            styles.statusBadge, 
            status === 'inTransit' ? styles.statusBadgeActive : styles.statusBadgePending
          ]}>
            <AppText style={[
              styles.statusBadgeText,
              status === 'inTransit' ? styles.statusActiveText : styles.statusPendingText
            ]}>
              {status === 'inTransit' ? 'In Transit' : status}
            </AppText>
          </View>
        )}
      </View>
      
      {/* Route Details Flow */}
      <View style={styles.routeRow}>
        <View style={styles.locationWrapper}>
          <MapPin size={ICON_SIZE.sm} color={COLORS.goldPrimary} />
          <AppText style={styles.locationText} numberOfLines={2}>
            {shipmentData.pickupLocation || 'Unknown'}
          </AppText>
        </View>
        
        <ArrowRight size={ICON_SIZE.xs} color={COLORS.textLight} style={styles.arrowIcon} />
        
        <View style={styles.locationWrapper}>
          <MapPin size={ICON_SIZE.sm} color={COLORS.goldPrimary} />
          <AppText style={styles.locationText} numberOfLines={2}>
            {shipmentData.deliveryLocation || 'Unknown'}
          </AppText>
        </View>
      </View>
      
      {/* Shipment Specs Grid */}
      <View style={styles.footerRow}>
        <View style={styles.infoBadge}>
          <Calendar size={ICON_SIZE.xs} color={COLORS.textSecondary} />
          <AppText style={styles.infoText}>N/A</AppText>
        </View>
        
        <View style={styles.infoBadge}>
          <Compass size={ICON_SIZE.xs} color={COLORS.textSecondary} />
          <AppText style={styles.infoText}>
            {shipmentData.numberOfHorses || 0} {shipmentData.numberOfHorses === 1 ? 'horse' : 'horses'}
          </AppText>
        </View>
      </View>
      
      {/* Primary Contextual Action Button */}
      {status === 'inTransit' && onCompletePress && (
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => onCompletePress(item._id)}
        >
          <AppText style={styles.actionButtonText}>Complete Delivery</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TripCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  routeHeader: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
  },
  statusBadge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xs,
  },
  statusBadgeActive: {
    backgroundColor: COLORS.greenLightBg,
    borderColor: COLORS.greenBorder,
    borderWidth: 0.5,
  },
  statusBadgePending: {
    backgroundColor: COLORS.goldLightBg,
    borderColor: COLORS.goldBorder,
    borderWidth: 0.5,
  },
  statusBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    textTransform: 'uppercase',
  },
  statusActiveText: {
    color: COLORS.greenPrimary,
  },
  statusPendingText: {
    color: COLORS.goldDarkText,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  locationWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  locationText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  arrowIcon: {
    marginHorizontal: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  actionButton: {
    backgroundColor: COLORS.goldPrimary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
  },
  actionButtonText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
  }
});