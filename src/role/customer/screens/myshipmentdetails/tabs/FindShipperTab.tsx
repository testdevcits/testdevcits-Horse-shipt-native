import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MapPin, Mail, Star, Check } from 'lucide-react-native';
import { AppText } from '../../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import customerService from '../../../../../api/services/customerService';

const ShipperProfileCard = ({ profile, shipmentId, alreadyInvited }: any) => {
  const [inviting, setInviting] = useState(false);
  const [isInvited, setIsInvited] = useState(alreadyInvited);

  // Update local state if the prop changes
  useEffect(() => {
    setIsInvited(alreadyInvited);
  }, [alreadyInvited]);

  const handleInvite = async () => {
    if (inviting) return;
    setInviting(true);
    try {
      const res = await customerService.inviteShipper(shipmentId, profile.id);
      if (res) {
        setIsInvited(true);
      }
    } catch (error) {
      console.error('Invite error:', error);
    } finally {
      setInviting(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={{
            uri: profile.profileImage || 'https://via.placeholder.com/150',
          }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <AppText style={styles.shipperName}>{profile.name}</AppText>
            <View style={styles.ratingBadge}>
              <Star
                size={12}
                color={COLORS.goldPrimary}
                fill={COLORS.goldPrimary}
              />
              <AppText style={styles.ratingText}>{profile.rating || 0}</AppText>
            </View>
          </View>
          <AppText style={styles.shipperTitle}>Horse transport shipper</AppText>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.infoLine}>
          <MapPin size={16} color={COLORS.goldPrimary} />
          <AppText style={styles.infoText} numberOfLines={1}>
            {profile.region || 'N/A'}
          </AppText>
        </View>
        <View style={styles.infoLine}>
          <Mail size={16} color={COLORS.goldPrimary} />
          <AppText style={styles.infoText} numberOfLines={1}>
            {profile.email || 'N/A'}
          </AppText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <AppText style={styles.statLabel}>COMPLETED</AppText>
          <AppText style={styles.statValue}>
            {profile.completedShipments || 0}
          </AppText>
        </View>
        <View style={styles.statBox}>
          <AppText style={styles.statLabel}>REVIEWS</AppText>
          <AppText style={styles.statValue}>
            {profile.totalReviews || 0}
          </AppText>
        </View>
      </View>

      {isInvited ? (
        <View style={styles.requestedBtn}>
          <Check size={18} color={COLORS.greenPrimary} />
          <AppText style={styles.requestedText}>Quote Requested</AppText>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.inviteBtn}
          onPress={handleInvite}
          disabled={inviting}
        >
          {inviting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <AppText style={styles.inviteBtnText}>Request Quote</AppText>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const FindShipperTab = ({ matching, invited, shipmentId }: any) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We stringify the matching array so useEffect only triggers when IDs actually change
  const matchingKey = JSON.stringify(matching);

  const fetchAllProfiles = useCallback(async () => {
    if (!matching || matching.length === 0) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch each profile individually but in parallel
      // We wrap each call in a try/catch so one fail doesn't break the whole list
      const promises = matching.map(async (id: string) => {
        try {
          const res = await customerService.getShipperProfile(id);
          return res.success ? res.data : null;
        } catch (e) {
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validProfiles = results.filter(p => p !== null);
      setProfiles(validProfiles);
    } catch (error) {
      console.error('Fetch all profiles error:', error);
    } finally {
      setLoading(false);
    }
  }, [matchingKey]);

  useEffect(() => {
    fetchAllProfiles();
  }, [fetchAllProfiles]);

  if (loading) {
    return (
      <View style={styles.centerLoader}>
        <ActivityIndicator size="large" color={COLORS.goldPrimary} />
        <AppText style={styles.loaderText}>Finding matched shippers...</AppText>
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <View style={styles.subHeaderBar}>
        <AppText style={styles.subHeaderText}>
          {profiles.length} shipper{profiles.length !== 1 ? 's' : ''} matched
        </AppText>
      </View>

      {profiles.map(profile => (
        <ShipperProfileCard
          key={profile.id}
          profile={profile}
          shipmentId={shipmentId}
          // Ensure invited is treated as an array of IDs
          alreadyInvited={invited?.includes(profile.id)}
        />
      ))}

      {profiles.length === 0 && (
        <View style={styles.emptyState}>
          <AppText style={styles.emptyText}>
            No shippers found matching this shipment.
          </AppText>
        </View>
      )}
    </View>
  );
};

export default FindShipperTab;

const styles = StyleSheet.create({
  tabContainer: { paddingBottom: 40 },
  centerLoader: { paddingVertical: 80, alignItems: 'center' },
  loaderText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  subHeaderBar: { paddingHorizontal: SPACING.lg, marginVertical: SPACING.md },
  subHeaderText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.grey100,
  },
  headerInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipperName: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  shipperTitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEBC2',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  detailsSection: { marginTop: 12, gap: 6 },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: COLORS.textSecondary, flex: 1 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  statLabel: { fontSize: 10, color: COLORS.textLight, fontFamily: FONTS.bold },
  statValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  inviteBtn: {
    backgroundColor: COLORS.goldPrimary,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  inviteBtnText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 15 },
  requestedBtn: {
    backgroundColor: '#E6F7F0',
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#A9E2CC',
  },
  requestedText: {
    color: COLORS.greenPrimary,
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: COLORS.textLight, fontFamily: FONTS.medium },
});
