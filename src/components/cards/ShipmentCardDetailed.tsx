import React, { memo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Circle, ChevronRight, Calendar, Info, Package } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

const STATUS_MAP: any = {
  open_for_offers: { label: 'Open for Offers', color: '#2563EB', bg: '#EFF6FF' },
  assigned: { label: 'Assigned', color: '#7C3AED', bg: '#F5F3FF' },
  delivered: { label: 'Delivered', color: COLORS.success, bg: '#F0FDF4' },
  in_transit: { label: 'In Transit', color: COLORS.warning, bg: '#FFFBEB' },
};

const ShipmentCardDetailed = memo(({ item, onPress }: { item: any; onPress: () => void }) => {
  const status = STATUS_MAP[item.status] || { label: item.status, color: COLORS.grey500, bg: COLORS.grey100 };
  const horse = item.horses[0];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      {/* Top Header: ID & Status */}
      <View style={styles.header}>
        <View style={styles.idBadge}>
          <Package size={14} color={COLORS.textSecondary} />
          <AppText style={styles.idText}>{item.shipmentCode}</AppText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <View style={[styles.dot, { backgroundColor: status.color }]} />
          <AppText style={[styles.statusText, { color: status.color }]}>{status.label}</AppText>
        </View>
      </View>

      {/* Main Content: Map Path */}
      <View style={styles.body}>
        <View style={styles.pathColumn}>
          <Circle size={10} color={COLORS.primary} fill={COLORS.primary} />
          <View style={styles.dottedLine} />
          <MapPin size={14} color={COLORS.error} fill={COLORS.error} />
        </View>
        
        <View style={styles.locationColumn}>
          <View style={styles.locItem}>
            <AppText style={styles.locTitle}>{item.pickupLocation}</AppText>
            <AppText style={styles.locDate}>
               {new Date(item.pickupDateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </AppText>
          </View>
          <View style={[styles.locItem, { marginTop: SPACING.lg }]}>
            <AppText style={styles.locTitle}>{item.deliveryLocation}</AppText>
            <AppText style={styles.locDate}>
               {new Date(item.deliveryDateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </AppText>
          </View>
        </View>

        <Image source={{ uri: horse.photo.url }} style={styles.horseThumb} />
      </View>

      <View style={styles.divider} />

      {/* Footer: Horse Count & Details */}
      <View style={styles.footer}>
        <View style={styles.footerDetail}>
           <AppText style={styles.footerLabel}>HORSES</AppText>
           <AppText style={styles.footerValue}>{item.numberOfHorses}</AppText>
        </View>
        <View style={styles.vDivider} />
        <View style={styles.footerDetail}>
           <AppText style={styles.footerLabel}>BREED</AppText>
           <AppText style={styles.footerValue} numberOfLines={1}>{horse.breed}</AppText>
        </View>
        <TouchableOpacity style={styles.detailsBtn}>
           <AppText style={styles.detailsBtnText}>Track</AppText>
           <ChevronRight size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  idBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.grey50, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round },
  idText: { fontSize: 11, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round },
  statusText: { fontSize: 10, fontFamily: FONTS.bold, textTransform: 'uppercase' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  body: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: SPACING.xs },
  pathColumn: { alignItems: 'center', width: 20, marginTop: 4 },
  dottedLine: { width: 1, height: 40, backgroundColor: COLORS.divider, marginVertical: 4 },
  locationColumn: { flex: 1, marginLeft: SPACING.sm },
  locItem: { justifyContent: 'center' },
  locTitle: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  locDate: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  horseThumb: { width: 64, height: 64, borderRadius: RADIUS.lg, backgroundColor: COLORS.grey100 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.md },
  footer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  footerDetail: { flex: 1 },
  footerLabel: { fontSize: 9, fontFamily: FONTS.bold, color: COLORS.textLight, letterSpacing: 1 },
  footerValue: { fontSize: 13, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  vDivider: { width: 1, height: 20, backgroundColor: COLORS.divider },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: SPACING.md },
  detailsBtnText: { color: COLORS.primary, fontFamily: FONTS.bold, fontSize: 13 }
});

export default ShipmentCardDetailed;