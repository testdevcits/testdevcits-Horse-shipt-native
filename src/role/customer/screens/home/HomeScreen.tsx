import React from 'react';
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

const HomeScreen = ({ navigation }) => {
  const { shipments, loading, refreshing, refresh } = useShipments();
  const {
    shippers,
    loading: shipperloading,
    refresh: shipperRefresh,
  } = useShippers();
  const handleShipperPress = (item: any) => {
    navigation.navigate('ShipperDetail', { item });
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
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
        <FlatList
          data={shipments.slice(0, 2)}
          keyExtractor={item => item?._id}
          ListHeaderComponent={
            <SectionHeader
              title="Current Shipments"
              onPress={() => navigation.navigate('Shipments')}
            />
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => refresh(true)}
              tintColor={COLORS.primary}
            />
          }
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

        {shippers && !shipperloading && !loading && (
          <FlatList
            data={shippers}
            horizontal={true}
            keyExtractor={item => item?.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ShipperCard
                item={item}
                onPress={() => handleShipperPress(item)}
              />
            )}
            contentContainerStyle={styles.list}
            stickyHeaderIndices={[0]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={COLORS.goldPrimary}
              />
            }
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
});

export default HomeScreen;
