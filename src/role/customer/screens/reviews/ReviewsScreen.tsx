import React, { useMemo } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { COLORS, ICON_SIZE } from '../../../../constants';
import { useReviews } from './useReviews';
import {
  AppHeader,
  AppText,
  EmptyState,
  ReviewCard,
  ReviewsSkeleton,
} from '../../../../components';
import AppIcon from '../../../../components/AppIcon';
import styles from './styles.reviews';

const ReviewsScreen = () => {
  const { reviews, loading, fetchReviews } = useReviews();

  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return '5.0';
    const sum = reviews.reduce((acc, r) => acc + (Number(r?.rating) || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const renderSummary = () => (
    <View style={styles.summaryCard}>
      <View style={styles.ratingCircle}>
        <AppText style={styles.ratingNum}>{avgRating}</AppText>
        <AppIcon
          name={'Star'}
          size={16}
          color={COLORS.white}
          fill={COLORS.white}
        />
      </View>
      <View style={styles.summaryText}>
        <AppText style={styles.summaryTitle}>Customer Reviews</AppText>
        <AppText style={styles.summarySub}>
          Based on {reviews.length}{' '}
          {reviews.length === 1 ? 'review' : 'reviews'}
        </AppText>
      </View>
    </View>
  );

  if (loading)
    return (
      <View style={styles.container}>
        <AppHeader title="Reviews & Ratings" />
        <ReviewsSkeleton />
      </View>
    );

  return (
    <View style={styles.container}>
      <AppHeader title="Reviews & Ratings" />

      <FlatList
        data={reviews}
        keyExtractor={item => item?._id}
        ListHeaderComponent={renderSummary}
        renderItem={({ item }) => <ReviewCard item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchReviews}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            // icon={MessageCircle}
            icon={
              <AppIcon
                name={'Package'}
                size={ICON_SIZE.xl}
                color={COLORS.lightGrey}
                strokeWidth={1.5}
              />
            }
            title="No Reviews Yet"
            message="Your shipment feedback from shippers will appear here."
          />
        }
      />
    </View>
  );
};

export default ReviewsScreen;
