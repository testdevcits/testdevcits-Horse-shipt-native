import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { Plus, PackageSearch, Award } from 'lucide-react-native';
import {
  COLORS,
  SPACING,
  FONTS,
  RADIUS,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  FONT_SIZE,
} from '../../../../constants';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  SectionHeader,
  ShipperCard,
} from '../../../../components';
import ShipmentCardDetailed from '../../../../components/cards/ShipmentCardDetailed';
import { useShipments } from './useShipments';
import imageIndex from '../../../../assets/images/imageIndex';
import { useShippers } from '../topratedshippers/useShippers';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchWishlistThunk, toggleWishlistThunk } from '../../../../redux/slices/wishlistSlice';
import { useSelector } from 'react-redux';

const HomeScreen = ({ navigation }: { navigation?: any }) => {
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector(state => state.wishlist);
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
        dispatch(fetchWishlistThunk(true)).unwrap().catch(() => null),
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

  const displayedShippers = wishlist.length > 0 ? wishlist : shippers;

  const { user } = useSelector((state: any) => state.auth || {});
  const userName = user?.name || user?.firstName || 'Not available';


  return (
    <View style={styles.container}>
      <AppHeader />

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
        <View style={styles.welcomeHeader}>
          <AppText style={styles.welcomeTitle}>Hello {userName},</AppText>
          <AppText style={styles.welcomeSub}>Good to see you again!</AppText>
        </View>

        <FlatList
          data={shipments.slice(0, 2)}
          keyExtractor={item => item?._id}
          scrollEnabled={false}
          ListHeaderComponent={
            <>
              <Pressable onPress={() => navigation.navigate('New')}>
                <Image
                  source={imageIndex.Banner}
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

        {displayedShippers && !shipperloading && !loading && (
          <FlatList
            data={displayedShippers}

            keyExtractor={(item, index) => item?.id || item?._id || index.toString()}
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
                  title="No Shippers Found"
                  message="Try adjusting your filters or search query."
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: SPACING.md,
  },

  list: {
    paddingBottom: SPACING.sm, // Extra space for FAB
  },
  // Welcome Header
  welcomeHeader: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,

  },
  welcomeTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  welcomeSub: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default HomeScreen;

