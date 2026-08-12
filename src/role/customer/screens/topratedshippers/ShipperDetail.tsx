import React from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  Star,
  MapPin,
  User,
  MessageSquare,
  Package,
  Compass,
  Heart,
} from 'lucide-react-native';

// Constants & Hooks
import { COLORS, ICON_SIZE } from '../../../../constants';
import styles from './shipperDetail.styles';
import { useShipperDetails } from './useShipperDetails';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { toggleWishlistThunk } from '../../../../redux/slices/wishlistSlice';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  ErrorView,
} from '../../../../components';
import imageIndex from '../../../../assets/images/imageIndex';
import { formatDate } from '../../../../utils/helpers';

const ShipperDetail = () => {
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const { wishlistIds } = useAppSelector(state => state.wishlist);

  const shipperId = route.params?.item?.id || route.params?.item?._id || route.params?.id;

  const { shipper, loading, refreshing, error, refresh } =
    useShipperDetails(shipperId);

  console.log("=================120", shipper)

  const targetId = shipperId || shipper?._id || shipper?.id;
  const isFavorite = targetId
    ? wishlistIds.includes(targetId) || !!shipper?.isWishlisted || !!shipper?.isFavorite
    : false;

  const handleToggleWishlist = () => {
    if (targetId) {
      dispatch(toggleWishlistThunk({ shipperId: targetId, shipperItem: shipper || route.params?.item }));
    }
  };

  // 1. Loading State
  if (loading && !refreshing) {
    return <AppLoader visible={true} />;
  }

  // 2. Error State
  if (error) {
    return <ErrorView message={error} onRetry={refresh} />;
  }

  // 3. Not Found State
  if (!shipper) {
    return (
      <EmptyState
        title="Not Found"
        message="Shipper profile could not be loaded."
        icon={User}
      />
    );
  }

  const renderReviewCard = (item: any, index: number) => (
    <View key={index} style={styles.reviewCard}>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            size={ICON_SIZE.xs}
            color={COLORS.primary}
            fill={s <= (item?.rating || 5) ? COLORS.primary : 'transparent'}
          />
        ))}
      </View>
      <AppText numberOfLines={4} style={styles.reviewBody}>
        {item?.reviewText ||
          'Great experience with this shipper! Very professional and timely.'}
      </AppText>
      <View style={styles.reviewFooter}>
        <View style={styles.avatarPlaceholder}>
          <User size={ICON_SIZE.xs} color={COLORS.grey400} />
        </View>
        <View>
          <AppText style={styles.reviewerName}>
            {item?.customerName || 'Not Available'}
          </AppText>
          <AppText style={styles.reviewDate}>{formatDate(item?.createdAt)}</AppText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Shipper Profile"
        showBack={true}
        showProfileImage={false}
        rightElement={
          <TouchableOpacity
            onPress={handleToggleWishlist}
            // disabled={isToggling}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ padding: 6 }}
          >
            <Heart
              size={22}
              color={isFavorite ? COLORS.error : COLORS.grey600}
              fill={isFavorite ? COLORS.error : 'transparent'}
            />
          </TouchableOpacity>
        }
      />
      <AppLoader visible={refreshing} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Banner and Profile Image */}
        <View style={styles.headerSection}>
          <Image
            source={
              {
                uri: shipper?.bannerImage,
              }
            }
            style={[styles.bannerImage, { backgroundColor: shipper?.bannerImage ? COLORS.white : COLORS.background }]}
          />
          <View style={styles.profileImageContainer}>
            <Image
              source={
                shipper?.profileImage !== '/default-avatar.png'
                  ? { uri: shipper?.profileImage }
                  : imageIndex.AccountIcon
              }
              style={styles.profileImage}
            />
          </View>
        </View>

        <AppText style={styles.mainName}>{shipper?.name}</AppText>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <AppText style={styles.statValue}>
              {shipper?.totalReviews || 0}
            </AppText>
            <AppText style={styles.statLabel}>Reviews</AppText>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.statBox}>
            <View style={styles.ratingRow}>
              <AppText style={styles.statValue}>
                {shipper?.rating > 0 ? shipper?.rating.toFixed(1) : 'New'}
              </AppText>
              <Star
                size={ICON_SIZE.xs}
                color={COLORS.primary}
                fill={COLORS.primary}
              />
            </View>
            <AppText style={styles.statLabel}>Rating</AppText>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.statBox}>
            <AppText style={styles.statValue}>
              {shipper?.completedShipments || 0}
            </AppText>
            <AppText style={styles.statLabel}>Shipments</AppText>
          </View>
        </View>

        {/* Location & Description */}
        <View style={styles.contentPadding}>
          <View style={styles.locationContainer}>
            <MapPin size={ICON_SIZE.sm} color={COLORS.primary} />
            <AppText style={styles.locationLabel}>{shipper?.region}</AppText>
          </View>

          <AppText style={styles.sectionTitleSmall}>Description</AppText>
          <AppText style={styles.descriptionText}>
            Professional equine transporter serving {shipper?.region}. We pride
            ourselves on safety, clear communication, and the well-being of your
            horses.
          </AppText>
        </View>

        {/* Preferred Operating Areas Section */}
        {shipper?.preferredAreas && shipper.preferredAreas.length > 0 && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Preferred Operating Areas</AppText>
            <View style={styles.contentPadding}>
              {shipper.preferredAreas.map((area: any, index: number) => {
                const locationName =
                  area?.locationName || area?.location || area?.address || 'Service Area';
                const radius = area?.radiusKm || area?.radius || 0;

                return (
                  <View key={area?.id || area?._id || index} style={styles.areaCard}>
                    <View style={styles.areaIconBox}>
                      <MapPin size={18} color={COLORS.primary} />
                    </View>
                    <View style={styles.areaContent}>
                      <AppText style={styles.areaLocationName} numberOfLines={2}>
                        {locationName}
                      </AppText>
                      {radius > 0 && (
                        <View style={styles.radiusBadge}>
                          <Compass size={12} color={COLORS.primary} />
                          <AppText style={styles.radiusText}>
                            {radius} km radius coverage
                          </AppText>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Reviews Section */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Reviews</AppText>
          {shipper?.reviews && shipper?.reviews.length > 0 ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {shipper?.reviews.map((rev: any, idx: number) =>
                  renderReviewCard(rev, idx),
                )}
              </ScrollView>
              {/* <TouchableOpacity style={styles.showMoreBtn}>
                <AppText style={styles.showMoreText}>Show more reviews</AppText>
              </TouchableOpacity> */}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <EmptyState
                title="No Reviews"
                message="Feedback will appear here once customers leave reviews."
                icon={MessageSquare}
              />
            </View>
          )}
        </View>

        {/* Shipments Section */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Shipment History</AppText>
          {shipper?.completedShipments > 0 ? (
            <View style={styles.contentPadding}>
              <View style={styles.shipmentCard}>
                <AppText style={styles.shipmentTitle}>Activity Summary</AppText>
                <AppText style={styles.descriptionText}>
                  This shipper has successfully completed{' '}
                  {shipper?.completedShipments} horse transports on HorseShipt.
                </AppText>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <EmptyState
                title="New Shipper"
                message="This shipper hasn't completed any tracked shipments yet."
                icon={Package}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShipperDetail;
