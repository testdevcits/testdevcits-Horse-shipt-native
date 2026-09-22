import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, View, TouchableOpacity, ScrollView } from 'react-native';
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  MapType,
} from 'react-native-maps';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Input } from '../../../../../components';
import { COLORS, SPACING } from '../../../../../constants';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import styles from './styles.AllAreasMapModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  areas: any[];
}

const ViewAllAreasMapModal: React.FC<Props> = ({ visible, onClose, areas }) => {
  const mapRef = useRef<MapView | null>(null);

  // Map settings state
  const [mapType, setMapType] = useState<MapType>('standard');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial load effect
  useEffect(() => {
    if (visible && areas.length > 0) {
      const allIds = areas.map((a, i) => a._id || String(i));
      setSelectedIds(allIds);
      if (allIds.length > 0) setFocusedId(allIds[0]);

      // Delay fit bounds slightly to ensure MapView layout has finished
      const timer = setTimeout(() => {
        fitSelectedAreas(areas);
      }, 400);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, areas]);

  // Helper to extract numeric coordinates safely
  const getAreaCoords = (area: any) => {
    let lat = 22.777927;
    let lng = 75.892304;
    if (area?.coordinates?.coordinates) {
      lng = Number(area.coordinates.coordinates[0]);
      lat = Number(area.coordinates.coordinates[1]);
    } else {
      if (area?.latitude) lat = parseFloat(area.latitude);
      if (area?.longitude) lng = parseFloat(area.longitude);
    }
    return { latitude: lat, longitude: lng };
  };

  const fitSelectedAreas = (areasToFit: any[]) => {
    if (!mapRef.current || areasToFit.length === 0) return;

    const coords = areasToFit.map(getAreaCoords);

    if (coords.length === 1) {
      const radKm = areasToFit[0].radiusKm || 50;
      mapRef.current.animateToRegion(
        {
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
          latitudeDelta: (radKm * 2.6) / 111,
          longitudeDelta: (radKm * 2.6) / 111,
        },
        500,
      );
    } else if (coords.length > 1) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 70, right: 60, bottom: 70, left: 60 },
        animated: true,
      });
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === areas.length) {
      setSelectedIds([]);
    } else {
      const allIds = areas.map((a, i) => a._id || String(i));
      setSelectedIds(allIds);
      fitSelectedAreas(areas);
    }
  };

  const handleFitSelected = () => {
    const activeAreas = areas.filter((a, i) =>
      selectedIds.includes(a._id || String(i)),
    );
    if (activeAreas.length > 0) {
      fitSelectedAreas(activeAreas);
    }
  };

  const handleFocusArea = (area: any, index: number) => {
    const id = area._id || String(index);
    setFocusedId(id);
    if (!selectedIds.includes(id)) {
      setSelectedIds(prev => [...prev, id]);
    }

    const { latitude, longitude } = getAreaCoords(area);
    const radKm = area.radiusKm || 50;

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: (radKm * 2.2) / 111,
        longitudeDelta: (radKm * 2.2) / 111,
      },
      500,
    );
  };

  const toggleMapType = () => {
    setMapType(prev => (prev === 'standard' ? 'hybrid' : 'standard'));
  };

  // Filter areas based on search input
  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return areas;
    const q = searchQuery.toLowerCase();
    return areas.filter(a => (a.locationName || '').toLowerCase().includes(q));
  }, [areas, searchQuery]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* HEADER */}
        <View style={styles.modalHeader}>
          <View style={styles.headerTitleCol}>
            <View style={styles.titleBadgeRow}>
              <AppText style={styles.modalTitle}>
                Preferred Coverage Map
              </AppText>
              <View style={styles.countPill}>
                <AppText style={styles.countPillText}>
                  {selectedIds.length}/{areas.length} Active
                </AppText>
              </View>
            </View>
            <AppText style={styles.modalSubTitle}>
              Tap any location card to focus or toggle checkboxes to customize
              visible radii.
            </AppText>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <AppIcon name="X" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* MAP CONTAINER WITH FLOATING OVERLAY CONTROLS */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            mapType={mapType}
            style={styles.mapView}
            initialRegion={{
              latitude: 22.777927,
              longitude: 75.892304,
              latitudeDelta: 3.5,
              longitudeDelta: 3.5,
            }}
          >
            {areas.map((area, index) => {
              const id = area._id || String(index);
              if (!selectedIds.includes(id)) return null;

              const { latitude, longitude } = getAreaCoords(area);
              const radiusKm = area.radiusKm || 50;
              const radiusMeters = radiusKm * 1000;
              const isFocused = focusedId === id;

              return (
                <React.Fragment key={id}>
                  <Marker
                    coordinate={{ latitude, longitude }}
                    title={`#${index + 1} ${area.locationName || 'Saved Area'}`}
                    description={`Coverage Radius: ${radiusKm} km`}
                    onPress={() => setFocusedId(id)}
                  >
                    <View
                      style={[
                        styles.customMarkerPin,
                        isFocused && styles.customMarkerPinFocused,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.customMarkerText,
                          isFocused && styles.customMarkerTextFocused,
                        ]}
                      >
                        {index + 1}
                      </AppText>
                    </View>
                  </Marker>
                  <Circle
                    center={{ latitude, longitude }}
                    radius={radiusMeters}
                    strokeColor={
                      isFocused
                        ? COLORS.saddleBrownOverlay95
                        : COLORS.saddleBrownOverlay75
                    }
                    strokeWidth={isFocused ? 3 : 2}
                    fillColor={
                      isFocused
                        ? COLORS.saddleBrownOverlay28
                        : COLORS.saddleBrownOverlay15
                    }
                  />
                </React.Fragment>
              );
            })}
          </MapView>

          {/* FLOATING ACTION TOOLBAR OVER MAP */}
          <View style={styles.floatingControlsContainer}>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={handleToggleSelectAll}
              activeOpacity={0.85}
            >
              {selectedIds.length === areas.length ? (
                <AppIcon name="EyeOff" size={15} color={COLORS.textPrimary} />
              ) : (
                <AppIcon name="Eye" size={15} color={COLORS.primary} />
              )}
              <AppText style={styles.floatingBtnText}>
                {selectedIds.length === areas.length ? 'Hide All' : 'Show All'}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={handleFitSelected}
              activeOpacity={0.85}
            >
              <AppIcon name="Maximize2" size={15} color={COLORS.primary} />
              <AppText style={styles.floatingBtnText}>Fit Bounds</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingBtnIconOnly}
              onPress={toggleMapType}
              activeOpacity={0.85}
            >
              <AppIcon
                name="Layers"
                size={16}
                color={
                  mapType === 'hybrid' ? COLORS.primary : COLORS.textPrimary
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTTOM DRAWER CONTAINER */}
        <View style={styles.bottomDrawer}>
          {/* SEARCH & TITLE BAR */}
          <View style={styles.drawerHeaderRow}>
            <AppText style={styles.drawerTitle}>
              Saved Locations ({filteredAreas.length})
            </AppText>

            <TouchableOpacity
              onPress={handleToggleSelectAll}
              activeOpacity={0.7}
              style={styles.selectAllToggleBtn}
            >
              <AppText style={styles.selectAllToggleText}>
                {selectedIds.length === areas.length
                  ? 'Deselect All'
                  : 'Select All'}
              </AppText>
            </TouchableOpacity>
          </View>

          {areas.length > 4 && (
            <View style={{ marginBottom: SPACING.sm }}>
              <Input
                placeholder="Search preferred locations..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon={
                  <AppIcon
                    name="Search"
                    size={16}
                    color={COLORS.textSecondary}
                  />
                }
                rightIcon={
                  searchQuery.length > 0 ? (
                    <AppIcon name="X" size={16} color={COLORS.textSecondary} />
                  ) : undefined
                }
                onRightIconPress={() => setSearchQuery('')}
              />
            </View>
          )}

          {/* LIST OF PREFERRED AREAS */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {filteredAreas.length > 0 ? (
              filteredAreas.map((area, index) => {
                const id = area._id || String(index);
                const isChecked = selectedIds.includes(id);
                const isFocused = focusedId === id;
                const { latitude, longitude } = getAreaCoords(area);

                return (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.areaCard,
                      isFocused && styles.areaCardFocused,
                    ]}
                    onPress={() => handleFocusArea(area, index)}
                    activeOpacity={0.85}
                  >
                    {/* CHECKBOX */}
                    <TouchableOpacity
                      style={styles.checkboxTouch}
                      onPress={() => toggleSelect(id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.checkboxSquare,
                          isChecked && styles.checkboxSquareChecked,
                        ]}
                      >
                        {isChecked && (
                          <AppIcon
                            name="Check"
                            size={13}
                            color={COLORS.white}
                          />
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* BADGE NUMBER */}
                    <View
                      style={[
                        styles.indexBadge,
                        isFocused && styles.indexBadgeFocused,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.indexBadgeText,
                          isFocused && styles.indexBadgeTextFocused,
                        ]}
                      >
                        {index + 1}
                      </AppText>
                    </View>

                    {/* DETAILS COLUMN */}
                    <View style={styles.areaDetailsCol}>
                      <AppText style={styles.areaNameText} numberOfLines={1}>
                        {area.locationName || 'Saved Area'}
                      </AppText>

                      <View style={styles.metaRow}>
                        <View style={styles.radiusPill}>
                          <AppIcon
                            name="MapPin"
                            size={11}
                            color={COLORS.primary}
                          />
                          <AppText style={styles.radiusPillText}>
                            {area.radiusKm || 50} km radius
                          </AppText>
                        </View>

                        <AppText style={styles.coordsText}>
                          {latitude.toFixed(4)}, {longitude.toFixed(4)}
                        </AppText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyStateContainer}>
                <AppIcon
                  name="Compass"
                  size={32}
                  color={COLORS.textSecondary}
                />
                <AppText style={styles.emptyStateText}>
                  No matching preferred areas found.
                </AppText>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ViewAllAreasMapModal;
