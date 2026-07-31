import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  Plus,
  MapPin,
  Pencil,
  Trash2,
  Map as MapIcon,
  Navigation,
  Compass,
} from 'lucide-react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import AddEditAreaModal from './AddEditAreaModal';
import ViewAllAreasMapModal from './ViewAllAreasMapModal';
import styles from './styles.preferredareas';

const MAX_AREAS = 4;

const PreferredAreasScreen = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewAllModalVisible, setIsViewAllModalVisible] = useState(false);
  const [selectedAreaToEdit, setSelectedAreaToEdit] = useState<any>(null);


  const fetchPreferredAreas = async () => {
    try {
      const res = await shipperService.getPreferredAreas();
      if (res?.success || Array.isArray(res?.data)) {
        setAreas(res.data || []);
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
      Alert.alert(
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

  const handleDeleteArea = (id: string, locationName: string) => {
    Alert.alert(
      'Delete Preferred Area',
      `Are you sure you want to delete "${locationName || 'this preferred area'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await shipperService.deletePreferredArea(id);
              if (res?.success) {
                Alert.alert('Success', 'Preferred area deleted successfully.');
                fetchPreferredAreas();
              } else {
                Alert.alert('Error', res?.message || 'Failed to delete area.');
              }
            } catch (error: any) {
              Alert.alert(
                'Error',
                error?.response?.data?.message || 'Failed to delete area.',
              );
            }
          },
        },
      ],
    );
  };

  const filledCount = areas.length;
  const progressPercent = Math.min((filledCount / MAX_AREAS) * 100, 100);

  return (
    <View style={styles.container}>
      <AppHeader title="Preferred Areas" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {/* HEADER SECTION */}
        <View style={styles.headerSection}>
          <View style={styles.headerTitleRow}>
            <AppText style={styles.headerTitle}>Preferred Areas</AppText>
          </View>
          <AppText style={styles.headerSubText}>
            Add up to 4 service areas, edit them clearly, and adjust the exact pin on the map when you need better precision.
          </AppText>


          <View>

            {!loading &&
              <View>


                {/* STEP / SLOT INDICATORS (1 FILLED, 2 OPEN, 3 OPEN, 4 OPEN) */}
                <View style={styles.slotsRow}>
                  {[1, 2, 3, 4].map(slotNum => {
                    const isFilled = slotNum <= filledCount;
                    return (
                      <View
                        key={slotNum}
                        style={[styles.slotBadge, isFilled && styles.slotBadgeFilled]}
                      >
                        <AppText
                          style={[
                            styles.slotBadgeNum,
                            isFilled && styles.slotBadgeNumFilled,
                          ]}
                        >
                          {slotNum}
                        </AppText>
                        <AppText
                          style={[
                            styles.slotBadgeText,
                            isFilled && styles.slotBadgeTextFilled,
                          ]}
                        >
                          {isFilled ? 'FILLED' : 'OPEN'}
                        </AppText>
                      </View>
                    );
                  })}
                </View>

                {/* PROGRESS BAR ROW */}
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                  </View>
                  <AppText style={styles.areaCountText}>
                    {filledCount} / {MAX_AREAS} areas added
                  </AppText>
                </View>

                {/* TOP ACTION BAR (+ Add New Area, See All Areas) */}
                <View style={styles.actionButtonsBar}>
                  <TouchableOpacity
                    style={styles.addAreaBtn}
                    onPress={handleAddNewArea}
                    activeOpacity={0.8}
                  >
                    <Plus size={18} color={COLORS.white} />
                    <AppText style={styles.addAreaBtnText}>Add New Area</AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.seeAllBtn}
                    onPress={() => setIsViewAllModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <MapIcon size={16} color={COLORS.textPrimary} />
                    <AppText style={styles.seeAllBtnText}>See All Areas</AppText>
                  </TouchableOpacity>
                </View>

              </View>
            }
          </View>

        </View>

        {/* LOADING INDICATOR */}
        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color={COLORS.goldPrimary}
            style={{ marginVertical: SPACING.xl }}
          />
        ) : areas.length === 0 ? (
          /* EMPTY STATE */
          <View style={styles.emptyStateBox}>
            <MapPin size={40} color={COLORS.goldPrimary} />
            <AppText style={styles.emptyTitle}>No Preferred Areas</AppText>
            <AppText style={styles.emptySub}>
              Set up to 4 working areas to receive targeted shipment matches near you.
            </AppText>
            <TouchableOpacity style={styles.addAreaBtn} onPress={handleAddNewArea}>
              <Plus size={16} color={COLORS.white} />
              <AppText style={styles.addAreaBtnText}>Add Preferred Area</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          /* PREFERRED AREA CARDS LIST */
          areas.map((area, index) => {
            // Extract coordinates
            // Mongo GeoJSON: coordinates: { type: "Point", coordinates: [lng, lat] }
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
                {/* Header Row: Badge & Location Title */}
                <View style={styles.areaCardHeader}>
                  <View style={styles.indexBadge}>
                    <AppText style={styles.indexBadgeText}>#{index + 1}</AppText>
                  </View>
                  <AppText style={styles.locationTitle} numberOfLines={2}>
                    {area.locationName || 'Saved Preferred Area'}
                  </AppText>
                </View>

                {/* Radius Pill Tag */}
                <View style={styles.radiusPill}>
                  <AppText style={styles.radiusPillText}>
                    📍 {radiusKm} km radius
                  </AppText>
                </View>

                {/* Coordinates Row (LATITUDE & LONGITUDE) */}
                <View style={styles.coordsRow}>
                  <View style={styles.coordBox}>
                    <AppText style={styles.coordLabel}>LATITUDE</AppText>
                    <AppText style={styles.coordVal}>
                      {lat.toFixed(5)}
                    </AppText>
                  </View>
                  <View style={styles.coordBox}>
                    <AppText style={styles.coordLabel}>LONGITUDE</AppText>
                    <AppText style={styles.coordVal}>
                      {lng.toFixed(5)}
                    </AppText>
                  </View>
                </View>

                {/* Saved Point Note */}
                <View style={styles.exactPointNoteRow}>
                  <Compass size={12} color={COLORS.textSecondary} />
                  <AppText style={styles.exactPointNoteText}>
                    Exact saved point for this preferred area
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
                      latitudeDelta: (radiusKm * 2.2) / 111, // approx delta per km
                      longitudeDelta: (radiusKm * 2.2) / 111,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Marker coordinate={{ latitude: lat, longitude: lng }} title={area.locationName} />
                    <Circle
                      center={{ latitude: lat, longitude: lng }}
                      radius={radiusMeters}
                      strokeColor="rgba(160, 99, 51, 0.8)"
                      strokeWidth={2}
                      fillColor="rgba(160, 99, 51, 0.18)"
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
                    <Pencil size={16} color={COLORS.white} />
                    <AppText style={styles.editCardBtnText}>Edit Area</AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteCardBtn}
                    onPress={() => handleDeleteArea(area._id, area.locationName)}
                    activeOpacity={0.8}
                  >
                    <Trash2 size={16} color="#DC2626" />
                    <AppText style={styles.deleteCardBtnText}>Delete</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ADD / EDIT MODAL */}
      <AddEditAreaModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchPreferredAreas}
        areaToEdit={selectedAreaToEdit}
      />

      {/* VIEW ALL AREAS IN ONE MAP MODAL */}
      <ViewAllAreasMapModal
        visible={isViewAllModalVisible}
        onClose={() => setIsViewAllModalVisible(false)}
        areas={areas}
      />
    </View>
  );
};


export default PreferredAreasScreen;
