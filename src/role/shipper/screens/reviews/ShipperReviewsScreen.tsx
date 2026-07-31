import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Star, MessageSquare } from 'lucide-react-native';
import moment from 'moment';
import { AppHeader, AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import imageIndex from '../../../../assets/images/imageIndex';
import styles from './styles.shipperreviews';

const ShipperReviewsScreen = ({ route }: any) => {
  const initialReviews = route?.params?.reviews || [];
  const initialProfile = route?.params?.profileData || null;

  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [profileData, setProfileData] = useState<any>(initialProfile);
  const [loading, setLoading] = useState(!initialReviews.length && !initialProfile);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = useCallback(async () => {
    try {
      const res = await shipperService.getProfile();
      if (res?.data) {
        setProfileData(res.data);
        if (res.data.reviews) {
          setReviews(res.data.reviews);
        }
      }
    } catch (error) {
      console.error('Fetch Shipper Reviews Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const avgRating = profileData?.rating || (reviews.length > 0
    ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : 5.0);
  const totalReviewsCount = profileData?.totalReviews || reviews.length;

  return (
    <View style={styles.container}>
      <AppHeader showBack title="Shipper Reviews" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.goldPrimary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.goldPrimary}
            />
          }
        >
          {/* RATING OVERVIEW SUMMARY CARD */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRatingRow}>
              <AppText style={styles.summaryRatingText}>
                {typeof avgRating === 'number' ? avgRating.toFixed(1) : avgRating}
              </AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={22}
                    color="#F59E0B"
                    fill={s <= Math.round(Number(avgRating)) ? '#F59E0B' : 'transparent'}
                  />
                ))}
              </View>
            </View>
            <AppText style={styles.summarySubText}>
              Based on {totalReviewsCount} customer {totalReviewsCount === 1 ? 'review' : 'reviews'}
            </AppText>
          </View>

          {/* SECTION HEADER */}
          <View style={styles.sectionHeaderRow}>
            <AppText style={styles.sectionTitle}>Reviews Received</AppText>
            <View style={styles.reviewCountBadge}>
              <AppText style={styles.reviewCountText}>
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </AppText>
            </View>
          </View>

          {/* REVIEWS LIST */}
          {reviews.length > 0 ? (
            reviews.map((item: any, idx: number) => {
              const customerName = item.customerName || item.customerId?.name || 'Customer';
              const avatarUri = item.customerId?.profileImage?.url || item.customerId?.profileImage;
              const dateFormatted = item.createdAt
                ? moment(item.createdAt).format('MMM DD, YYYY')
                : 'Recent';

              return (
                <View key={item._id || idx} style={styles.reviewCard}>
                  <View style={styles.reviewerHeader}>
                    <View style={styles.reviewerRow}>
                      <Image
                        source={
                          avatarUri && typeof avatarUri === 'string' && avatarUri.trim() !== ''
                            ? { uri: avatarUri }
                            : imageIndex.AccountIcon
                        }
                        style={styles.reviewerAvatar}
                      />
                      <View style={styles.reviewerInfo}>
                        <AppText style={styles.reviewerName}>{customerName}</AppText>
                        <AppText style={styles.reviewDate}>{dateFormatted}</AppText>
                      </View>
                    </View>

                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          size={14}
                          color="#F59E0B"
                          fill={s <= (item.rating || 5) ? '#F59E0B' : 'transparent'}
                        />
                      ))}
                    </View>
                  </View>

                  <AppText style={styles.reviewText}>
                    {item.reviewText || 'Great experience working together!'}
                  </AppText>

                  {item.source && (
                    <View style={styles.sourceBadge}>
                      <AppText style={styles.sourceBadgeText}>{item.source}</AppText>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <MessageSquare size={36} color={COLORS.textSecondary} />
              <AppText style={styles.emptyText}>No reviews received yet</AppText>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ShipperReviewsScreen;
