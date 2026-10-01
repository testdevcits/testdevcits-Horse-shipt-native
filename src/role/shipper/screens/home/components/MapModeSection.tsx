import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Platform,
} from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS, SPACING } from '../../../../../constants';
import MapShipmentSelectItem from './MapShipmentSelectItem';
import RouteMapSection from './RouteMapSection';
import styles from '../styles.shipperhome';

interface MapModeSectionProps {
  filteredShipments: any[];
  selectedMapShipment: any;
  mapRef: any;
  refreshing: boolean;
  onRefresh: () => void;
  renderHeader: () => React.ReactNode;
  handleSelectMapShipment: (item: any) => void;
  handleNavigateToDetails: (item: any) => void;
  getRegionForShipment: (item: any) => any;
  navigation: any;
  setViewMode: (mode: 'list' | 'map') => void;
}

export const MapModeSection: React.FC<MapModeSectionProps> = React.memo(
  ({
    filteredShipments,
    selectedMapShipment,
    mapRef,
    refreshing,
    onRefresh,
    renderHeader,
    handleSelectMapShipment,
    handleNavigateToDetails,
    getRegionForShipment,
    navigation,
    setViewMode,
  }) => {
    return (
      <ScrollView
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {renderHeader()}

        <View style={styles.mapModeContainer}>
          {/* Shipments List Selection Card */}
          <View style={styles.mapShipmentsListCard}>
            <View style={styles.sectionHeaderRow}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <AppIcon name={'List'} size={18} color={COLORS.saddleBrown} />
                <AppText style={styles.mapSectionTitle}>
                  Shipments ({filteredShipments.length})
                </AppText>
              </View>

              <TouchableOpacity style={styles.viewAllBtn}>
                <AppText style={styles.viewAllText}>View All</AppText>
                <AppIcon
                  name={'ChevronRight'}
                  size={16}
                  color={COLORS.saddleBrown}
                />
              </TouchableOpacity>
            </View>

            <AppText style={styles.mapSectionSub}>
              Select a shipment to view route on map
            </AppText>

            {/* Selection Items Table using FlatList */}
            <View style={styles.mapSelectionTable}>
              <FlatList
                data={filteredShipments}
                keyExtractor={(item, index) =>
                  item?._id || item?.id || String(index)
                }
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <MapShipmentSelectItem
                    item={item}
                    isSelected={selectedMapShipment?._id === item?._id}
                    isLast={index === filteredShipments.length - 1}
                    onSelect={handleSelectMapShipment}
                    onNavigateDetails={handleNavigateToDetails}
                  />
                )}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
              />
            </View>
          </View>

          {/* Shipment Route Map Card */}
          {filteredShipments.length > 0 && (
            <RouteMapSection
              selectedMapShipment={selectedMapShipment}
              mapRef={mapRef}
              getRegionForShipment={getRegionForShipment}
              onNavigateMapDirection={() => {
                navigation.navigate('ShipmentMapDirection', {
                  shipmentData: selectedMapShipment,
                });
              }}
              onCloseMap={() => setViewMode('list')}
            />
          )}
        </View>
      </ScrollView>
    );
  },
);
