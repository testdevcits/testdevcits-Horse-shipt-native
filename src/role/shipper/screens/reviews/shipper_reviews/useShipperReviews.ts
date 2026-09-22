import { useCallback, useEffect, useState } from 'react';
import shipperService from '../../../../../api/services/shipperService';

const useShipperReviews = ({ initialReviews, initialProfile }: any) => {
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [profileData, setProfileData] = useState<any>(initialProfile);
  const [loading, setLoading] = useState(
    !initialReviews.length && !initialProfile,
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = useCallback(async () => {
    try {
      const res = await shipperService.getProfile();
      if (res?.data) {
        setProfileData(res?.data);
        if (res?.data?.reviews) {
          setReviews(res?.data?.reviews);
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

  const avgRating =
    profileData?.rating ||
    (reviews.length > 0
      ? (
          reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) /
          reviews.length
        ).toFixed(1)
      : 5.0);
  const totalReviewsCount = profileData?.totalReviews || reviews.length;
  return {
    avgRating,
    totalReviewsCount,
    reviews,
    loading,
    refreshing,
    onRefresh,
  };
};

export default useShipperReviews;
