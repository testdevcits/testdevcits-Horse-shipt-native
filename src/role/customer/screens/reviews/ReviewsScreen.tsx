import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Star, MessageCircle } from 'lucide-react-native';
import { COLORS, SPACING, FONTS, RADIUS } from '../../../../constants';
import { useReviews } from './useReviews';
import {
  AppLoader,
  AppText,
  EmptyState,
  ReviewCard,
} from '../../../../components';

const ReviewsScreen = () => {
  const { reviews, loading, fetchReviews } = useReviews();

  const renderSummary = () => (
    <View style={styles.summaryCard}>
      <View style={styles.ratingCircle}>
        <AppText style={styles.ratingNum}>4.8</AppText>
        <Star size={16} color={COLORS.white} fill={COLORS.white} />
      </View>
      <View style={styles.summaryText}>
        <AppText style={styles.summaryTitle}>Excellent Service</AppText>
        <AppText style={styles.summarySub}>
          Based on {reviews.length} shipper reviews
        </AppText>
      </View>
    </View>
  );

  if (loading) return <AppLoader visible={true} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Reviews & Ratings</AppText>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderSummary}
        renderItem={({ item }) => <ReviewCard item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchReviews}
            tintColor={COLORS.goldPrimary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={MessageCircle}
            title="No Reviews Yet"
            message="Your shipment feedback from shippers will appear here."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  title: { fontSize: 24, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  list: { padding: SPACING.lg },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldPrimary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  ratingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingNum: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.white },
  summaryText: { marginLeft: SPACING.lg },
  summaryTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.white },
  summarySub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});

export default ReviewsScreen;
