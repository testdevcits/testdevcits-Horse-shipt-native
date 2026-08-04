import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MapPin, Mail, Star, Check, Users, Truck, Calendar } from 'lucide-react-native';
import { AppText } from '../../../../../components';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../../constants';
import customerService from '../../../../../api/services/customerService';
import imageIndex from '../../../../../assets/images/imageIndex';

const ShipperProfileCard = ({ profile, shipmentId, alreadyInvited }: any) => {
  const [inviting, setInviting] = useState(false);
  const [isInvited, setIsInvited] = useState(alreadyInvited);

  useEffect(() => {
    setIsInvited(alreadyInvited);
  }, [alreadyInvited]);

  const handleInvite = async () => {
    if (inviting) return;
    setInviting(true);
    try {
      const res = await customerService.inviteShipper(shipmentId, profile?.id);
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
          source={
            profile?.profileImage
              ? { uri: profile?.profileImage }
              : imageIndex.AccountIcon
          }
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <AppText style={styles.shipperName}>{profile?.name}</AppText>
            <View style={styles.ratingBadge}>
              <Star
                size={ICON_SIZE.xs}
                color={COLORS.goldPrimary}
                fill={COLORS.goldPrimary}
              />
              <AppText style={styles.ratingText}>{profile?.rating || 0}</AppText>
            </View>
          </View>
          <AppText style={styles.shipperTitle}>Horse transport shipper</AppText>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.infoLine}>
          <MapPin size={ICON_SIZE.xs} color={COLORS.goldPrimary} />
          <AppText style={styles.infoText} numberOfLines={1}>
            {profile?.region || 'N/A'}
          </AppText>
        </View>
        <View style={styles.infoLine}>
          <Mail size={ICON_SIZE.xs} color={COLORS.goldPrimary} />
          <AppText style={styles.infoText} numberOfLines={1}>
            {profile?.email || 'N/A'}
          </AppText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <AppText style={styles.statLabel}>COMPLETED</AppText>
          <AppText style={styles.statValue}>
            {profile?.completedShipments || 0}
          </AppText>
        </View>
        <View style={styles.statBox}>
          <AppText style={styles.statLabel}>REVIEWS</AppText>
          <AppText style={styles.statValue}>
            {profile?.totalReviews || 0}
          </AppText>
        </View>
      </View>

      {isInvited ? (
        <View style={styles.requestedBtn}>
          <Check size={ICON_SIZE.sm} color={COLORS.greenPrimary} />
          <AppText style={styles.requestedText}>Quote Requested</AppText>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.inviteBtn}
          onPress={handleInvite}
          disabled={inviting}
          activeOpacity={0.8}
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

  const matchingKey = JSON.stringify(matching);

  const fetchAllProfiles = useCallback(async () => {
    if (!matching || matching.length === 0) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
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
          key={profile?.id}
          profile={profile}
          shipmentId={shipmentId}
          alreadyInvited={invited?.includes(profile?.id)}
        />
      ))}

      {profiles.length === 0 && (
        <View style={styles.emptyCardContainer}>
          <View style={styles.emptyIconCircle}>
            <Users size={32} color={COLORS.primary} />
          </View>

          <AppText style={styles.emptyTitle}>No Matching Shippers Found</AppText>

          <AppText style={styles.emptySubtitle}>
            There are currently no verified shippers matching your specific route or schedule criteria.
          </AppText>

          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Truck size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>Public Marketplace Visibility</AppText>
                <AppText style={styles.infoCardText}>
                  Your shipment is broadcast live to all drivers in the network.
                </AppText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Calendar size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>Flexible Dates</AppText>
                <AppText style={styles.infoCardText}>
                  Expanding your pickup or delivery window helps match more drivers.
                </AppText>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default FindShipperTab;

const styles = StyleSheet.create({
  tabContainer: { paddingBottom: SPACING.xl },
  centerLoader: { paddingVertical: 60, alignItems: 'center' },
  loaderText: {
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  subHeaderBar: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  subHeaderText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.grey100,
  },
  headerInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipperName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  shipperTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: '#FFEBC2',
    gap: 3,
  },
  ratingText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  detailsSection: { marginTop: SPACING.sm, gap: 4 },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  infoText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, flex: 1 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: SPACING.xs + 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, fontFamily: FONTS.bold },
  statValue: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  inviteBtn: {
    backgroundColor: COLORS.goldPrimary,
    height: 44,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  inviteBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
  requestedBtn: {
    backgroundColor: '#E6F7F0',
    height: 44,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: '#A9E2CC',
  },
  requestedText: {
    color: COLORS.greenPrimary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },

  /* Empty State Styles */
  emptyCardContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  infoCardsContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  infoCardText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

