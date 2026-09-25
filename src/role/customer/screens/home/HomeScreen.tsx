import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { PackageSearch, Award } from 'lucide-react-native';
import { COLORS, SCREEN_WIDTH } from '../../../../constants';
import {
  AppHeader,
  AppLoader,
  EmptyState,
  HomeSkeleton,
  SectionHeader,
  ShipperCard,
} from '../../../../components';
import ShipmentCardDetailed from '../../../../components/cards/shipmentcard_detailed/ShipmentCardDetailed';
import { useShipments } from './useShipments';
import imageIndex from '../../../../assets/images/imageIndex';
import { useShippers } from '../topratedshippers/shipperlist/useShippers';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchWishlistThunk } from '../../../../redux/slices/wishlistSlice';
import { useSelector } from 'react-redux';
import styles from './styles.home';

const HomeScreen = ({ navigation }: { navigation?: any }) => {
  const dispatch = useAppDispatch();
  const {
    wishlist,
    wishlistIds,
    loading: wishlistLoading,
  } = useAppSelector(state => state.wishlist);
  const { shipments, loading, refreshing, refresh } = useShipments();
  const {
    shippers,
    loading: shipperloading,
    toggleWishlist,
    refresh: shipperRefresh,
  } = useShippers();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchWishlistThunk());
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refresh(true),
        dispatch(fetchWishlistThunk(true))
          .unwrap()
          .catch(() => null),
        shipperRefresh ? shipperRefresh() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Error refreshing home screen:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleShipperPress = (item: any) => {
    navigation.navigate('ShipperDetail', { item });
  };

  const displayedShippers = useMemo(() => {
    return (wishlist || []).map((item: any) => {
      const rawId =
        item?.id || item?._id || item?.shipperId?._id || item?.shipperId;
      const sId = rawId ? String(rawId) : '';
      const img =
        typeof item?.profileImage === 'string'
          ? item.profileImage
          : item?.profileImage?.url || item?.avatar || item?.image || '';
      const shipperName =
        item?.name ||
        item?.shipperName ||
        `${item?.firstName || ''} ${item?.lastName || ''}`.trim() ||
        'Professional Shipper';
      const locationRegion =
        item?.region ||
        item?.location ||
        item?.address ||
        item?.city ||
        'Region N/A';

      return {
        ...item,
        _id: sId || item?._id || item?.id,
        id: sId || item?.id || item?._id,
        profileImage: img,
        name: shipperName,
        region: locationRegion,
        rating: item?.rating ?? 0,
        reviewCount: item?.reviewCount ?? 0,
        isFavorite: true,
        isWishlisted: true,
      };
    });
  }, [wishlist]);

  const { user } = useSelector((state: any) => state.auth || {});
  const userName = user?.name || user?.firstName || 'Not available';

  const isInitialLoading =
    (loading || shipperloading || wishlistLoading) &&
    !isRefreshing &&
    !refreshing;

  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <HomeSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title={`Hello ${userName},`}
        subTitle="Good to see you again!"
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* <View style={styles.welcomeHeader}>
          <AppText style={styles.welcomeTitle}>Hello {userName},</AppText>
          <AppText style={styles.welcomeSub}>Good to see you again!</AppText>
        </View> */}

        <FlatList
          data={shipments?.slice(0, 5)}
          keyExtractor={item => item?._id}
          scrollEnabled={false}
          ListHeaderComponent={
            !loading ? (
              <>
                <Pressable onPress={() => navigation.navigate('New')}>
                  <Image
                    source={imageIndex?.Banner}
                    style={{
                      width: SCREEN_WIDTH - 16,
                      height: 216,
                      alignSelf: 'center',
                      borderRadius: 20,
                    }}
                    resizeMode="stretch"
                  />
                </Pressable>
                <SectionHeader
                  title="Current Shipments"
                  onPress={() => navigation.navigate('Shipments')}
                />
              </>
            ) : null
          }
          renderItem={({ item }) => (
            <ShipmentCardDetailed
              item={item}
              onPress={() => {
                navigation.navigate('MyShipmentDetails', {
                  item: item,
                  quoteId: item?.quoteId,
                });
              }}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                icon={PackageSearch}
                title="No Shipments"
                message="You haven't created any shipment requests yet."
              />
            ) : (
              <AppLoader visible={true} />
            )
          }
        />
        {!shipperloading && !loading && (
          <SectionHeader
            title="My Favorite Shippers"
            onPress={() => navigation.navigate('TopShippers')}
          />
        )}

        {!shipperloading && !loading && (
          <FlatList
            data={displayedShippers}
            keyExtractor={(item, index) =>
              item?.id || item?._id || index.toString()
            }
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ShipperCard
                item={item}
                onPress={() => handleShipperPress(item)}
                onFavoritePress={toggleWishlist}
                customstyle={{ width: SCREEN_WIDTH - 20 }}
              />
            )}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              !loading ? (
                <EmptyState
                  icon={Award}
                  title="No Favorite Shippers"
                  message="You haven't saved any favorite shippers yet."
                />
              ) : (
                <AppLoader visible={true} />
              )
            }
          />
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
