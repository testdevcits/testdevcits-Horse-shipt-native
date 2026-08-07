import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
  Platform,
  Animated,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import {
  X,
  Check,
  MapPin,
  Maximize2,
  Eye,
  EyeOff,
  Layers,
  Search,
  Navigation,
  Compass,
  CheckSquare,
  Square,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Input } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';

const { width, height } = Dimensions.get('window');

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
    return areas.filter(a =>
      (a.locationName || '').toLowerCase().includes(q),
    );
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
              <AppText style={styles.modalTitle}>Preferred Coverage Map</AppText>
              <View style={styles.countPill}>
                <AppText style={styles.countPillText}>
                  {selectedIds.length}/{areas.length} Active
                </AppText>
              </View>
            </View>
            <AppText style={styles.modalSubTitle}>
              Tap any location card to focus or toggle checkboxes to customize visible radii.
            </AppText>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <X size={20} color={COLORS.textPrimary} />
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
                        ? 'rgba(160, 99, 51, 0.95)'
                        : 'rgba(160, 99, 51, 0.75)'
                    }
                    strokeWidth={isFocused ? 3 : 2}
                    fillColor={
                      isFocused
                        ? 'rgba(160, 99, 51, 0.28)'
                        : 'rgba(160, 99, 51, 0.15)'
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
                <EyeOff size={15} color={COLORS.textPrimary} />
              ) : (
                <Eye size={15} color={COLORS.primary} />
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
              <Maximize2 size={15} color={COLORS.primary} />
              <AppText style={styles.floatingBtnText}>Fit Bounds</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingBtnIconOnly}
              onPress={toggleMapType}
              activeOpacity={0.85}
            >
              <Layers
                size={16}
                color={mapType === 'hybrid' ? COLORS.primary : COLORS.textPrimary}
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
                {selectedIds.length === areas.length ? 'Deselect All' : 'Select All'}
              </AppText>
            </TouchableOpacity>
          </View>

          {areas.length > 4 && (
            <View style={{ marginBottom: SPACING.sm }}>
              <Input
                placeholder="Search preferred locations..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon={<Search size={16} color={COLORS.textSecondary} />}
                rightIcon={
                  searchQuery.length > 0 ? (
                    <X size={16} color={COLORS.textSecondary} />
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
                        {isChecked && <Check size={13} color={COLORS.white} />}
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
                          <MapPin size={11} color={COLORS.primary} />
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
                <Compass size={32} color={COLORS.textSecondary} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // MODAL HEADER
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: COLORS.white,
  },
  headerTitleCol: {
    flex: 1,
    gap: 2,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  modalTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  countPill: {
    backgroundColor: COLORS.goldLightBg,
    borderColor: COLORS.goldBorder,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  countPillText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  modalSubTitle: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  closeBtn: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },

  // MAP VIEW & FLOATING CONTROLS
  mapContainer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },

  floatingControlsContainer: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    zIndex: 10,
  },
  floatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 7,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  floatingBtnText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  floatingBtnIconOnly: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  // CUSTOM MARKERS
  customMarkerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  customMarkerPinFocused: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D97706',
    borderColor: COLORS.white,
    transform: [{ scale: 1.1 }],
  },
  customMarkerText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  customMarkerTextFocused: {
    fontSize: 13,
  },

  // BOTTOM DRAWER
  bottomDrawer: {
    height: height * 0.36,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm + 2,
    paddingBottom: SPACING.xs,
  },
  drawerTitle: {
    fontSize: FONT_SIZE.xs + 2,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  selectAllToggleBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  selectAllToggleText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  // SEARCH BAR
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey100 || '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.sm,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    height: 36,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    padding: 0,
  },

  // LIST SCROLL
  listScrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: SPACING.xs + 2,
  },

  // AREA ITEM CARD
  areaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  areaCardFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.goldLightBg,
  },
  checkboxTouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSquareChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  indexBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.grey100 || '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexBadgeFocused: {
    backgroundColor: COLORS.primary,
  },
  indexBadgeText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  indexBadgeTextFocused: {
    color: COLORS.white,
  },

  areaDetailsCol: {
    flex: 1,
    gap: 2,
  },
  areaNameText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  radiusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  radiusPillText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  coordsText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // EMPTY STATE
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.xs,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
});

export default ViewAllAreasMapModal;
