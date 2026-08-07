import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { Truck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, FONTS } from '../../../../constants';
import useMyShipments, { ShipmentTab } from './useMyShipments';
import { useAppDispatch } from '../../../../hooks/redux';
import { deleteCustomerShipment } from '../../../../redux/slices/customerShipmentSlice';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  ConfirmationModal,
} from '../../../../components';
import ShipmentHorizontalCard from '../../../../components/cards/ShipmentCardDetailed';
import styles from './styles.myshipments';

const MyShipments = ({ navigation }: { navigation?: any }) => {
  const dispatch = useAppDispatch();
  const {
    filteredData,
    loading,
    refreshing,
    activeTab,
    setActiveTab,
    counts,
    fetchShipments,
  } = useMyShipments();

  const [shipmentToDelete, setShipmentToDelete] = useState<any>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const tabs: ShipmentTab[] = [
    'Upcoming',
    'Draft',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  const handleShipmentPress = useCallback((item: any) => {
    const isDraftItem = item?.publish === false || (item?.status || '').toLowerCase() === 'draft';
    if (isDraftItem) {
      navigation?.navigate('NewShipment', {
        isEdit: true,
        shipmentData: item,
      });
    } else {
      navigation?.navigate('MyShipmentDetails', {
        item: item,
        quoteId: item?.quoteId,
      });
    }
  }, [navigation]);

  const handleInitiateDelete = useCallback((item: any) => {
    setShipmentToDelete(item);
    setIsDeleteModalVisible(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!shipmentToDelete?._id) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteCustomerShipment(shipmentToDelete._id)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Draft Deleted',
        text2: 'Draft shipment deleted successfully.',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: err || 'Failed to delete draft shipment',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalVisible(false);
      setShipmentToDelete(null);
    }
  };

  const keyExtractor = useCallback((item: any) => item?._id || String(Math.random()), []);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <ShipmentHorizontalCard
      item={item}
      onPress={() => handleShipmentPress(item)}
      onDelete={handleInitiateDelete}
    />
  ), [handleShipmentPress, handleInitiateDelete]);

  const renderTab = (tab: ShipmentTab) => {
    const isActive = activeTab === tab;
    // Map count keys
    const countKey = tab.replace(' ', '') as keyof typeof counts;
    const count = counts[countKey] || 0;

    return (
      <TouchableOpacity
        key={tab}
        onPress={() => setActiveTab(tab)}
        style={[styles.tab, isActive && styles.activeTab]}
      >
        <AppText style={[styles.tabText, isActive && styles.activeTabText]}>
          {tab}
        </AppText>
        <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
          <AppText
            style={[styles.countText, isActive && styles.activeCountText]}
          >
            {count}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Shipments" />

      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {tabs.map(renderTab)}
        </ScrollView>
      </View>

      <AppLoader visible={loading && !refreshing} />

      <FlatList
        data={filteredData}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchShipments} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={Truck}
              title={`No ${activeTab} Shipments`}
              message="Your shipments will appear here once they reach this stage."
            />
          ) : null
        }
      />

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        type="danger"
        title="Delete Draft Shipment?"
        description="Are you sure you want to delete this draft shipment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalVisible(false);
            setShipmentToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
};

export default MyShipments;
