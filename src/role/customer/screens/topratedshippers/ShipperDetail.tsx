import React from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  Star,
  MapPin,
  User,
  MessageSquare,
  Package,
} from 'lucide-react-native';

// Constants & Hooks
import { COLORS, ICON_SIZE } from '../../../../constants';
import styles from './shipperDetail.styles';
import { useShipperDetails } from './useShipperDetails';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  ErrorView,
} from '../../../../components';
import imageIndex from '../../../../assets/images/imageIndex';

const ShipperDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const shipperId = route.params?.item?.id || route.params?.id;

  const { shipper, loading, refreshing, error, refresh } =
    useShipperDetails(shipperId);

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
            color={COLORS.goldPrimary}
            fill={s <= (item?.rating || 5) ? COLORS.goldPrimary : 'transparent'}
          />
        ))}
      </View>
      <AppText numberOfLines={4} style={styles.reviewBody}>
        {item?.comment ||
          'Great experience with this shipper! Very professional and timely.'}
      </AppText>
      <View style={styles.reviewFooter}>
        <View style={styles.avatarPlaceholder}>
          <User size={ICON_SIZE.xs} color={COLORS.grey400} />
        </View>
        <View>
          <AppText style={styles.reviewerName}>
            {item?.userName || 'Verified User'}
          </AppText>
          <AppText style={styles.reviewDate}>{item?.date || 'Recent'}</AppText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Shipper Profile" showBack={true} />
      <AppLoader visible={refreshing} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {/* Banner and Profile Image */}
        <View style={styles.headerSection}>
          <Image
            source={
              shipper?.bannerImage
                ? {
                  uri: shipper?.bannerImage,
                }
                : imageIndex.HorseBg
            }
            style={styles.bannerImage}
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
                color={COLORS.goldPrimary}
                fill={COLORS.goldPrimary}
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
            <MapPin size={ICON_SIZE.sm} color={COLORS.goldPrimary} />
            <AppText style={styles.locationLabel}>{shipper?.region}</AppText>
          </View>

          <AppText style={styles.sectionTitleSmall}>Description</AppText>
          <AppText style={styles.descriptionText}>
            Professional equine transporter serving {shipper?.region}. We pride
            ourselves on safety, clear communication, and the well-being of your
            horses.
          </AppText>
        </View>

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
