import React, { useState, useEffect, Suspense, lazy } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import {
  AppHeader,
  AppText,
  ShipmentsSkeleton,
} from '../../../../../components';
import { COLORS } from '../../../../../constants';
import shipperService from '../../../../../api/services/shipperService';
import styles from './styles.preferredareas';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from '../../../../../utils/toast';
import PreferredAreaCard from './components/PreferredAreaCard';
import PreferredAreasHeader from './components/PreferredAreasHeader';

const MAX_AREAS = 4;
const ConfirmationModal = lazy(
  () =>
    import(
      '../../../../../components/common/ConfirmationModal/ConfirmationModal'
    ),
);

const PreferredAreasScreen = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewAllModalVisible, setIsViewAllModalVisible] = useState(false);
  const [selectedAreaToEdit, setSelectedAreaToEdit] = useState<any>(null);

  const AddEditAreaModal = lazy(
    () => import('../add_edit_areas/AddEditAreaModal'),
  );
  const ViewAllAreasMapModal = lazy(
    () => import('../view_all_area_map/ViewAllAreasMapModal'),
  );

  // Delete Confirmation Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPreferredAreas = async () => {
    try {
      const res = await shipperService.getPreferredAreas();
      if (res?.success || Array.isArray(res?.data)) {
        setAreas(res?.data || []);
      }
    } catch (error: any) {
      console.error('Fetch Preferred Areas Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPreferredAreas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPreferredAreas();
  };

  const handleAddNewArea = () => {
    if (areas.length >= MAX_AREAS) {
      showInfoToast(
        'Limit Reached',
        `You can add a maximum of ${MAX_AREAS} preferred service areas.`,
      );
      return;
    }
    setSelectedAreaToEdit(null);
    setIsModalVisible(true);
  };

  const handleEditArea = (area: any) => {
    setSelectedAreaToEdit(area);
    setIsModalVisible(true);
  };

  const handleDeleteAreaPrompt = (id: string, locationName: string) => {
    setAreaToDelete({ id, name: locationName });
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return;
    setIsDeleting(true);
    try {
      const res = await shipperService.deletePreferredArea(areaToDelete.id);
      if (res?.success) {
        showSuccessToast('Success', 'Preferred area deleted successfully.');
        setDeleteModalVisible(false);
        setAreaToDelete(null);
        fetchPreferredAreas();
      } else {
        showErrorToast('Error', res?.message || 'Failed to delete area.');
      }
    } catch (error: any) {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'Failed to delete area.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filledCount = areas.length;
  const progressPercent = Math.min((filledCount / MAX_AREAS) * 100, 100);

  const renderHeader = () => (
    <PreferredAreasHeader
      filledCount={filledCount}
      maxAreas={MAX_AREAS}
      progressPercent={progressPercent}
      onAddNewArea={handleAddNewArea}
      onViewMap={() => setIsViewAllModalVisible(true)}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyStateCard}>
        <View style={styles.emptyIconBg}>
          <AppIcon name={'MapPin'} size={26} color={COLORS.primary} />
        </View>
        <AppText style={styles.emptyTitle}>No Preferred Areas Set</AppText>
        <AppText style={styles.emptySub}>
          Define up to 4 working zones with customized radii to receive targeted
          shipment matches and notifications near you.
        </AppText>
        <TouchableOpacity
          style={styles.addAreaBtn}
          onPress={handleAddNewArea}
          activeOpacity={0.8}
        >
          <AppIcon name={'Plus'} size={16} color={COLORS.white} />
          <AppText style={styles.addAreaBtnText}>Add Preferred Area</AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAreaItem = ({
    item: area,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <PreferredAreaCard
      area={area}
      index={index}
      onEditArea={handleEditArea}
      onDeleteAreaPrompt={handleDeleteAreaPrompt}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader title="Preferred Areas" showBack showProfileImage={false} />
        <ShipmentsSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Preferred Areas" showBack showProfileImage={false} />

      <FlatList
        data={areas}
        keyExtractor={(item, index) => item?._id || index.toString()}
        renderItem={renderAreaItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.scrollContent,
          areas.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* ADD / EDIT MODAL */}
      <Suspense fallback={null}>
        <AddEditAreaModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSuccess={fetchPreferredAreas}
          areaToEdit={selectedAreaToEdit}
        />
      </Suspense>

      {/* VIEW ALL AREAS IN ONE MAP MODAL */}
      <Suspense fallback={null}>
        <ViewAllAreasMapModal
          visible={isViewAllModalVisible}
          onClose={() => setIsViewAllModalVisible(false)}
          areas={areas}
        />
      </Suspense>

      {/* DELETE CONFIRMATION MODAL */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            setAreaToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Preferred Area"
          description={`Are you sure you want to delete "${
            areaToDelete?.name || 'this preferred area'
          }"?`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </Suspense>
    </View>
  );
};

export default PreferredAreasScreen;
