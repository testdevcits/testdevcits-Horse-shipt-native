import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Image,
  Pressable,
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

type ListItemType =
  | { type: 'SECTION_HEADER'; title: string; onMorePress: () => void }
  | { type: 'SHIPMENT_ITEM'; data: any }
  | { type: 'SHIPMENT_EMPTY' }
  | { type: 'SHIPPER_ITEM'; data: any }
  | { type: 'SHIPPER_EMPTY' }
  | { type: 'LOADER' };

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

  const listData = useMemo(() => {
    const items: ListItemType[] = [];

    // Current Shipments Section Header
    items.push({
      type: 'SECTION_HEADER',
      title: 'Current Shipments',
      onMorePress: () => navigation.navigate('Shipments'),
    });

    if (loading) {
      items.push({ type: 'LOADER' });
    } else if (shipments && shipments.length > 0) {
      shipments.slice(0, 5).forEach((s: any) => {
        items.push({ type: 'SHIPMENT_ITEM', data: s });
      });
    } else {
      items.push({ type: 'SHIPMENT_EMPTY' });
    }

    // Favorite Shippers Section Header
    if (!shipperloading && !loading) {
      items.push({
        type: 'SECTION_HEADER',
        title: 'My Favorite Shippers',
        onMorePress: () => navigation.navigate('TopShippers'),
      });

      if (displayedShippers && displayedShippers.length > 0) {
        displayedShippers.forEach((s: any) => {
          items.push({ type: 'SHIPPER_ITEM', data: s });
        });
      } else {
        items.push({ type: 'SHIPPER_EMPTY' });
      }
    }

    return items;
  }, [shipments, displayedShippers, loading, shipperloading, navigation]);

  const renderListItem = useCallback(
    ({ item }: { item: ListItemType }) => {
      switch (item.type) {
        case 'SECTION_HEADER':
          return (
            <SectionHeader
              title={item.title}
              onPress={item.onMorePress}
            />
          );
        case 'SHIPMENT_ITEM':
          return (
            <ShipmentCardDetailed
              item={item.data}
              onPress={() => {
                navigation.navigate('MyShipmentDetails', {
                  item: item.data,
                  quoteId: item.data?.quoteId,
                });
              }}
            />
          );
        case 'SHIPMENT_EMPTY':
          return (
            <EmptyState
              icon={PackageSearch}
              title="No Shipments"
              message="You haven't created any shipment requests yet."
            />
          );
        case 'SHIPPER_ITEM':
          return (
            <ShipperCard
              item={item.data}
              onPress={() => handleShipperPress(item.data)}
              onFavoritePress={toggleWishlist}
              customstyle={{ width: SCREEN_WIDTH - 20 }}
            />
          );
        case 'SHIPPER_EMPTY':
          return (
            <EmptyState
              icon={Award}
              title="No Favorite Shippers"
              message="You haven't saved any favorite shippers yet."
            />
          );
        case 'LOADER':
          return <AppLoader visible={true} />;
        default:
          return null;
      }
    },
    [navigation, toggleWishlist]
  );

  const keyExtractor = useCallback((item: ListItemType, index: number) => {
    if (item.type === 'SHIPMENT_ITEM') {
      return `shipment-${item.data?._id || item.data?.id || index}`;
    }
    if (item.type === 'SHIPPER_ITEM') {
      return `shipper-${item.data?.id || item.data?._id || index}`;
    }
    return `${item.type}-${index}`;
  }, []);

  const ListHeader = useMemo(
    () => (
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
    ),
    [navigation]
  );

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

      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderListItem}
        ListHeaderComponent={ListHeader}
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
      />
    </View>
  );
};

export default HomeScreen;
