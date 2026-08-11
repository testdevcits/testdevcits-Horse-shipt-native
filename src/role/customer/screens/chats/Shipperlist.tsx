import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { MessageCircleOff } from 'lucide-react-native';
import useShipperList from './useShipperList';
import styles from './styles.shipperlist';
import {
  AppHeader,
  AppText,
  ChatlistCard,
  EmptyState,
  ErrorView,
  SearchBarCompt,
  AppSelect, // Make sure to add 'customSelectorStyle' prop support in AppSelect.tsx
  AppLoader,
} from '../../../../components';
import { COLORS } from '../../../../constants';
import imageIndex from '../../../../assets/images/imageIndex';

const ShipperList = ({ navigation }: { navigation?: any }) => {
  const {
    shippers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    refresh,
  } = useShipperList();

  return (
    <View style={styles.container}>
      <AppHeader />
      <AppLoader visible={loading} />

      {/* Header with Search and Filter Dropdown */}

      {error ? (
        <ErrorView message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={shippers}
          keyExtractor={item => item?._id}
          ListHeaderComponent={
            <View style={styles.header}>
              <AppText style={styles.screenTitle}>Messages</AppText>

              <SearchBarCompt
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search"
              />

              <View style={styles.filterContainer}>
                <AppSelect
                  label="" // Empty label for header style
                  value={activeFilter}
                  options={['All', 'Online', 'Offline']}
                  placeholder="Filter"
                  onSelect={item => setActiveFilter(item as any)}
                  // Passing a style override to make it small and fit the header
                  customSelectorStyle={styles.miniSelect}
                />
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ChatlistCard
              item={item}
              onPress={() =>
                navigation.navigate('ChatDetails', {
                  shipmentId: item?.shipmentId,
                  isChatLocked: item?.isChatLocked,
                  avatar: item?.avatar ? { uri: item?.avatar } : imageIndex.AccountIcon
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading && shippers.length > 0}
              onRefresh={refresh}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                icon={MessageCircleOff}
                title="No Conversations"
                message="Your shipment related chats will appear here once started."
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default ShipperList;
