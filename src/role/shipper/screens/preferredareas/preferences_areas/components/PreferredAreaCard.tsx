import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import styles from '../styles.preferredareas';

interface PreferredAreaCardProps {
  area: any;
  index: number;
  onEditArea: (area: any) => void;
  onDeleteAreaPrompt: (id: string, name: string) => void;
}

const PreferredAreaCard: React.FC<PreferredAreaCardProps> = ({
  area,
  index,
  onEditArea,
  onDeleteAreaPrompt,
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
          onPress={() => onEditArea(area)}
          activeOpacity={0.8}
        >
          <AppIcon name={'Pencil'} size={16} color={COLORS.white} />
          <AppText style={styles.editCardBtnText}>Edit Area</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteCardBtn}
          onPress={() => onDeleteAreaPrompt(area._id, area.locationName)}
          activeOpacity={0.8}
        >
          <AppIcon name={'Trash2'} size={16} color={COLORS.redPrimary} />
          <AppText style={styles.deleteCardBtnText}>Delete</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(PreferredAreaCard);
