import React from 'react';
import { View, FlatList, TextInput, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Search, MessageCircleOff } from 'lucide-react-native';
import useShipperList from './useShipperList';
import styles from './styles.shipperlist';
import { AppText, ChatlistCard, EmptyState, ErrorView, SearchBarCompt } from '../../../../components';
import { COLORS } from '../../../../constants';


const ShipperList = ({ navigation }) => {
  const {
    shippers, loading, error, searchQuery, setSearchQuery,
    activeFilter, setActiveFilter, refresh
  } = useShipperList();

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <AppText style={styles.screenTitle}>Shipment Chats</AppText>
        <SearchBarCompt
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search shipment or shipper"
        // containerStyle={{ marginTop: 10 }} // Optional: add extra margin if needed
        />
      </View>

      {/* Modern Segmented Filter */}
      <View style={styles.filterWrapper}>
        <View style={styles.filterTrack}>
          {['All', 'Online', 'Offline'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f as any)}
              style={[styles.filterBtn, activeFilter === f && styles.activeFilterBtn]}
            >
              <AppText style={[styles.filterText, activeFilter === f && styles.activeFilterText]}>
                {f}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error ? (
        <ErrorView message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={shippers}
          keyExtractor={(item) => item.shipmentId}
          renderItem={({ item }) => <ChatlistCard item={item}
          // onPress={() => { navigation.navigate("ChatDetails", { shipmentId: item?.shipmentId }) }}


          />

          }


          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading && shippers.length > 0} onRefresh={refresh} tintColor={COLORS.goldPrimary} />}
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