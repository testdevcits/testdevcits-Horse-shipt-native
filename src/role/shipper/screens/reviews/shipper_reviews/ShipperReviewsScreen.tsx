import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  Image,
  RefreshControl,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  AppHeader,
  AppText,
  EmptyState,
  ReviewsSkeleton,
} from '../../../../../components';
import { formatDate } from '../../../../../utils/helpers';
import styles from './styles.shipperreviews';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import useShipperReviews from './useShipperReviews';
import { Award, CheckCircle } from 'lucide-react-native';

const ShipperReviewsScreen = ({ route }: any) => {
  const initialReviews = route?.params?.reviews || [];
  const initialProfile = route?.params?.profileData || null;

  const {
    avgRating,
    totalReviewsCount,
    reviews,
    loading,
    refreshing,
    onRefresh,
  } = useShipperReviews({ initialReviews, initialProfile });

  const [selectedFilter, setSelectedFilter] = useState<
    'all' | '5' | '4' | 'low'
  >('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const getInitials = (name: string) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Filter reviews dynamically based on selected filter chip
  const filteredReviews = useMemo(() => {
    if (selectedFilter === '5') {
      return reviews.filter((r: any) => Math.round(r?.rating || 5) === 5);
    }
    if (selectedFilter === '4') {
      return reviews.filter((r: any) => Math.round(r?.rating || 5) === 4);
    }
    if (selectedFilter === 'low') {
      return reviews.filter((r: any) => Math.round(r?.rating || 5) <= 3);
    }
    return reviews;
  }, [reviews, selectedFilter]);

  const ratingNumber =
    typeof avgRating === 'number' ? avgRating : parseFloat(avgRating) || 5.0;

  const renderHeader = () => (
    <>
      {/* RATING OVERVIEW HERO SUMMARY CARD */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeaderRow}>
          <View style={styles.summaryMainCol}>
            <View style={styles.summaryRatingBox}>
              <AppText style={styles.summaryRatingText}>
                {ratingNumber.toFixed(1)}
              </AppText>
            </View>

            <View style={styles.ratingMetaCol}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <AppIcon
                    key={s}
                    name={'Star'}
                    size={20}
                    color={COLORS.warning || '#F59E0B'}
                    fill={
                      s <= Math.round(ratingNumber)
                        ? COLORS.warning || '#F59E0B'
                        : 'transparent'
                    }
                  />
                ))}
              </View>
              <AppText style={styles.summarySubText}>
                Based on {totalReviewsCount}{' '}
                {totalReviewsCount === 1
                  ? 'customer review'
                  : 'customer reviews'}
              </AppText>
            </View>
          </View>

          <View style={styles.badgePill}>
            <Award size={12} color="#065F46" />
            <AppText style={styles.badgePillText}>Top Rated</AppText>
          </View>
        </View>
      </View>

      {/* FILTER CHIPS ROW */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setSelectedFilter('all')}
          style={[
            styles.filterChip,
            selectedFilter === 'all' && styles.filterChipActive,
          ]}
        >
          <AppText
            style={[
              styles.filterChipText,
              selectedFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            All ({reviews.length})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setSelectedFilter('5')}
          style={[
            styles.filterChip,
            selectedFilter === '5' && styles.filterChipActive,
          ]}
        >
          <AppText
            style={[
              styles.filterChipText,
              selectedFilter === '5' && styles.filterChipTextActive,
            ]}
          >
            5 Stars (
            {
              reviews.filter((r: any) => Math.round(r?.rating || 5) === 5)
                .length
            }
            )
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setSelectedFilter('4')}
          style={[
            styles.filterChip,
            selectedFilter === '4' && styles.filterChipActive,
          ]}
        >
          <AppText
            style={[
              styles.filterChipText,
              selectedFilter === '4' && styles.filterChipTextActive,
            ]}
          >
            4 Stars (
            {
              reviews.filter((r: any) => Math.round(r?.rating || 5) === 4)
                .length
            }
            )
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setSelectedFilter('low')}
          style={[
            styles.filterChip,
            selectedFilter === 'low' && styles.filterChipActive,
          ]}
        >
          <AppText
            style={[
              styles.filterChipText,
              selectedFilter === 'low' && styles.filterChipTextActive,
            ]}
          >
            3 Stars & Below (
            {reviews.filter((r: any) => Math.round(r?.rating || 5) <= 3).length}
            )
          </AppText>
        </TouchableOpacity>
      </ScrollView>

      {/* SECTION HEADER */}
      <View style={styles.sectionHeaderRow}>
        <AppText style={styles.sectionTitle}>Reviews Received</AppText>
        <View style={styles.reviewCountBadge}>
          <AppText style={styles.reviewCountText}>
            {filteredReviews.length}{' '}
            {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
          </AppText>
        </View>
      </View>
    </>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyCard}>
        <EmptyState
          icon={
            <AppIcon name={'MessageSquare'} size={56} color={COLORS.zinc400} />
          }
          title="No Reviews Match Filter"
          message="There are no customer reviews matching the selected filter criteria."
        />
      </View>
    );
  };

  const renderReviewItem = ({ item, index }: { item: any; index: number }) => {
    const customerName =
      item?.customerName || item?.customerId?.name || 'Horse Owner';
    const avatarUri =
      item?.customerId?.profileImage?.url || item?.customerId?.profileImage;
    const itemId = item?._id || index.toString();
    const hasAvatar =
      avatarUri &&
      typeof avatarUri === 'string' &&
      avatarUri.trim() !== '' &&
      !imageErrors[itemId];

    const dateFormatted = item?.createdAt
      ? formatDate(item?.createdAt, 'MMM DD, YYYY')
      : 'Recent';

    const itemRating = Math.min(Math.max(Number(item?.rating || 5), 1), 5);

    return (
      <View key={itemId} style={styles.reviewCard}>
        <View style={styles.reviewerHeader}>
          <View style={styles.reviewerRow}>
            {hasAvatar ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.reviewerAvatar}
                onError={() =>
                  setImageErrors(prev => ({ ...prev, [itemId]: true }))
                }
              />
            ) : (
              <View style={styles.avatarFallback}>
                <AppText style={styles.avatarInitials}>
                  {getInitials(customerName)}
                </AppText>
              </View>
            )}

            <View style={styles.reviewerInfo}>
              <View style={styles.reviewerNameRow}>
                <AppText style={styles.reviewerName} numberOfLines={1}>
                  {customerName}
                </AppText>
              </View>
              <AppText style={styles.reviewDate}>{dateFormatted}</AppText>
            </View>
          </View>

          <View style={styles.starsContainer}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <AppIcon
                  key={s}
                  name={'Star'}
                  size={14}
                  color={COLORS.warning || '#F59E0B'}
                  fill={
                    s <= itemRating
                      ? COLORS.warning || '#F59E0B'
                      : 'transparent'
                  }
                />
              ))}
            </View>
          </View>
        </View>

        <AppText style={styles.reviewText}>
          {item?.reviewText ||
            'Great experience working together! Highly recommended.'}
        </AppText>

        <View style={styles.cardFooterRow}>
          <View style={styles.verifiedBadge}>
            <CheckCircle size={12} color="#10B981" />
            <AppText style={styles.verifiedBadgeText}>
              Verified Transport
            </AppText>
          </View>

          {item?.source && (
            <View style={styles.sourceBadge}>
              <AppText style={styles.sourceBadgeText}>{item?.source}</AppText>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader showBack title="Customer Reviews" />
        <ReviewsSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader showBack title="Customer Reviews" />

      <FlatList
        data={filteredReviews}
        keyExtractor={(item, index) => item?._id || index.toString()}
        renderItem={renderReviewItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.scrollContent,
          filteredReviews.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.brandBrown}
          />
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
};

export default ShipperReviewsScreen;
