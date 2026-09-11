import React, { useEffect, useState, useCallback } from 'react';
import {
  
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';

import { AppText } from '../../../../../../components';
import {
  COLORS,
  
  ICON_SIZE,
} from '../../../../../../constants';
import customerService from '../../../../../../api/services/customerService';
import imageIndex from '../../../../../../assets/images/imageIndex';
import AppIcon from '../../../../../../components/AppIcon';
import styles from './styles.FindShippers';

const ShipperProfileCard = ({
  profile,
  shipmentId,
  alreadyInvited,
  showRequestButton = true,
}: any) => {
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
              <AppIcon
                name={'Star'}
                size={ICON_SIZE.xs}
                color={COLORS.primary}
                fill={COLORS.primary}
              />
              <AppText style={styles.ratingText}>
                {profile?.rating || 0}
              </AppText>
            </View>
          </View>
          <AppText style={styles.shipperTitle}>Horse transport shipper</AppText>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.infoLine}>
          <AppIcon name={'MapPin'} size={ICON_SIZE.xs} color={COLORS.primary} />
          <AppText style={styles.infoText} numberOfLines={1}>
            {profile?.region || 'N/A'}
          </AppText>
        </View>
        <View style={styles.infoLine}>
          <AppIcon name={'Mail'} size={ICON_SIZE.xs} color={COLORS.primary} />
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
          <AppIcon
            name={'Check'}
            size={ICON_SIZE.sm}
            color={COLORS.greenPrimary}
          />
          <AppText style={styles.requestedText}>Quote Requested</AppText>
        </View>
      ) : (
        showRequestButton && (
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
        )
      )}
    </View>
  );
};

const FindShipperTab = ({ matching, invited, shipmentId, status }: any) => {
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
        <ActivityIndicator size="large" color={COLORS.primary} />
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
          showRequestButton={
            status === 'in_transit' || status === 'delivered' ? false : true
          }
        />
      ))}

      {profiles.length === 0 && (
        <View style={styles.emptyCardContainer}>
          <View style={styles.emptyIconCircle}>
            <AppIcon name={'Users'} size={32} color={COLORS.primary} />
          </View>

          <AppText style={styles.emptyTitle}>
            No Matching Shippers Found
          </AppText>

          <AppText style={styles.emptySubtitle}>
            There are currently no verified shippers matching your specific
            route or schedule criteria.
          </AppText>

          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <AppIcon name={'Truck'} size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>
                  Public Marketplace Visibility
                </AppText>
                <AppText style={styles.infoCardText}>
                  Your shipment is broadcast live to all drivers in the network.
                </AppText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <AppIcon name={'Calendar'} size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoTextWrapper}>
                <AppText style={styles.infoCardTitle}>Flexible Dates</AppText>
                <AppText style={styles.infoCardText}>
                  Expanding your pickup or delivery window helps match more
                  drivers.
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

 
