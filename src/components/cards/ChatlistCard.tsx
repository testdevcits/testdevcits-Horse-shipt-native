import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, ChevronRight, Circle } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

const ChatListCard = ({ item, onPress }: { item: any, onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={[styles.statusIndicator, { backgroundColor: item.isOnline ? COLORS.success : COLORS.grey400 }]} />
        </View>
        <View style={styles.nameInfo}>
          <AppText style={styles.name}>{item.name}</AppText>
          <AppText style={styles.email}>{item.email}</AppText>
        </View>
        <ChevronRight size={18} color={COLORS.grey300} />
      </View>

      <View style={styles.divider} />

      {/* Shipment Route Section */}
      <View style={styles.routeSection}>
        <View style={styles.codeRow}>
          <AppText style={styles.codeLabel}>SHIPMENT CODE</AppText>
          <AppText style={styles.shipmentCode}>{item.shipmentCode}</AppText>
        </View>
        
        <View style={styles.locationGrid}>
          <View style={styles.locationItem}>
            <Circle size={8} color={COLORS.goldPrimary} fill={COLORS.goldPrimary} />
            <AppText style={styles.locationText} numberOfLines={1}>{item.pickupLocation}</AppText>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.locationItem}>
            <MapPin size={10} color={COLORS.error} />
            <AppText style={styles.locationText} numberOfLines={1}>{item.deliveryLocation}</AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatListCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.grey100 },
  statusIndicator: { position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.white },
  nameInfo: { flex: 1, marginLeft: SPACING.md },
  name: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary },
  email: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.md },
  routeSection: { gap: SPACING.sm },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeLabel: { fontSize: 9, fontFamily: FONTS.bold, color: COLORS.textLight, letterSpacing: 0.5 },
  shipmentCode: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.goldPrimary },
  locationGrid: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  locationText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  routeLine: { width: 20, height: 1, backgroundColor: COLORS.goldBorder, borderStyle: 'dashed' },
});