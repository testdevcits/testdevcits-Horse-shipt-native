import React, { useState, useEffect, Suspense, lazy } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';

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
    <View style={styles.heroCard}>
      {/* HERO HEADER TITLE ROW */}
      <View style={styles.heroHeaderRow}>
        <View style={styles.heroTitleLeft}>
          <View style={styles.heroIconBox}>
            <AppIcon name={'MapPin'} size={20} color={COLORS.primary} />
          </View>
          <AppText style={styles.heroTitle}>Preferred Areas</AppText>
        </View>
        <View style={styles.heroBadge}>
          <AppText style={styles.heroBadgeText}>
            {filledCount}/{MAX_AREAS} Active
          </AppText>
        </View>
      </View>

      <AppText style={styles.heroSubText}>
        Set up to 4 operational zones to receive matched shipment notifications
        in your active coverage regions.
      </AppText>

      {/* STEP / SLOT CAPSULES */}
      <View style={styles.slotsRow}>
        {[1, 2, 3, 4].map(slotNum => {
          const isFilled = slotNum <= filledCount;
          return (
            <View
              key={slotNum}
              style={[styles.slotBadge, isFilled && styles.slotBadgeFilled]}
            >
              <AppIcon
                name={isFilled ? 'Check' : 'Plus'}
                size={12}
                color={isFilled ? COLORS.primary : COLORS.textSecondary}
              />
              <AppText
                style={[
                  styles.slotBadgeNum,
                  isFilled && styles.slotBadgeNumFilled,
                ]}
              >
                Slot {slotNum}
              </AppText>
            </View>
          );
        })}
      </View>

      {/* PROGRESS BAR ROW */}
      <View style={styles.progressRow}>
        <View style={styles.progressBarBg}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <View style={styles.progressTextRow}>
          <AppText style={styles.areaCountText}>
            {filledCount} of {MAX_AREAS} areas configured
          </AppText>
          <AppText style={styles.progressPercentText}>
            {Math.round(progressPercent)}%
          </AppText>
        </View>
      </View>

      {/* TOP ACTION BUTTONS BAR */}
      <View style={styles.actionButtonsBar}>
        <TouchableOpacity
          style={styles.addAreaBtn}
          onPress={handleAddNewArea}
          activeOpacity={0.8}
        >
          <AppIcon name={'Plus'} size={18} color={COLORS.white} />
          <AppText style={styles.addAreaBtnText}>Add New Area</AppText>
        </TouchableOpacity>
        {areas.length > 0 && (
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => setIsViewAllModalVisible(true)}
            activeOpacity={0.8}
          >
            <AppIcon name={'Map'} size={16} color={COLORS.textPrimary} />
            <AppText style={styles.seeAllBtnText}>View Map</AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  }) => {
    let lat = 22.777927;
    let lng = 75.892304;

    if (
      area.coordinates?.coordinates &&
      Array.isArray(area.coordinates.coordinates) &&
      area.coordinates.coordinates.length >= 2
    ) {
      lng = area.coordinates.coordinates[0];
      lat = area.coordinates.coordinates[1];
    } else {
      if (area.latitude) lat = parseFloat(area.latitude);
      if (area.longitude) lng = parseFloat(area.longitude);
    }

    const radiusKm = area.radiusKm || 50;
    const radiusMeters = radiusKm * 1000;

    return (
      <View key={area._id || index} style={styles.areaCard}>
        {/* Header Row: Badge, Location Title & Radius Badge */}
        <View style={styles.areaCardHeader}>
          <View style={styles.areaHeaderLeft}>
            <View style={styles.indexBadge}>
              <AppText style={styles.indexBadgeText}>#{index + 1}</AppText>
            </View>
            <AppText style={styles.locationTitle} numberOfLines={2}>
              {area.locationName || 'Saved Preferred Area'}
            </AppText>
          </View>
          <View style={styles.radiusPill}>
            <AppIcon
              name={'Radio'}
              size={12}
              color={COLORS.amberPrimary || COLORS.primary}
            />
            <AppText style={styles.radiusPillText}>
              {radiusKm} km radius
            </AppText>
          </View>
        </View>

        {/* Coordinates Row (LATITUDE & LONGITUDE) */}
        <View style={styles.coordsRow}>
          <View style={styles.coordBox}>
            <AppText style={styles.coordLabel}>LATITUDE</AppText>
            <AppText style={styles.coordVal}>{lat.toFixed(5)}</AppText>
          </View>
          <View style={styles.coordBox}>
            <AppText style={styles.coordLabel}>LONGITUDE</AppText>
            <AppText style={styles.coordVal}>{lng.toFixed(5)}</AppText>
          </View>
        </View>

        {/* Saved Point Note */}
        <View style={styles.exactPointNoteRow}>
          <AppIcon name={'Compass'} size={14} color={COLORS.textSecondary} />
          <AppText style={styles.exactPointNoteText}>
            Center point for proximity matching & notification dispatch
          </AppText>
        </View>

        {/* MAP VIEW PREVIEW */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapView}
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: (radiusKm * 2.2) / 111,
              longitudeDelta: (radiusKm * 2.2) / 111,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{ latitude: lat, longitude: lng }}
              title={area.locationName}
            />
            <Circle
              center={{ latitude: lat, longitude: lng }}
              radius={radiusMeters}
              strokeColor={COLORS.saddleBrownOverlay80}
              strokeWidth={2}
              fillColor={COLORS.saddleBrownOverlay18}
            />
          </MapView>
        </View>

        {/* CARD ACTION BUTTONS */}
        <View style={styles.cardActionsRow}>
          <TouchableOpacity
            style={styles.editCardBtn}
            onPress={() => handleEditArea(area)}
            activeOpacity={0.8}
          >
            <AppIcon name={'Pencil'} size={16} color={COLORS.white} />
            <AppText style={styles.editCardBtnText}>Edit Area</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteCardBtn}
            onPress={() => handleDeleteAreaPrompt(area._id, area.locationName)}
            activeOpacity={0.8}
          >
            <AppIcon name={'Trash2'} size={16} color={COLORS.redPrimary} />
            <AppText style={styles.deleteCardBtnText}>Delete</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
