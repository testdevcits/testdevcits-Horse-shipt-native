import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { X, MapPin, Compass, Navigation } from 'lucide-react-native';
import { AppText, Input } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import LocationPicker, { LocationSelectResult } from '../../../../components/common/LocationPicker/LocationPicker';
import styles from './styles.preferredareas';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  areaToEdit?: any;
}

const RADIUS_PRESETS = [25, 50, 75, 100];

const AddEditAreaModal = ({ visible, onClose, onSuccess, areaToEdit }: Props) => {
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radiusKm, setRadiusKm] = useState('50');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    locationName?: string;
    latitude?: string;
    longitude?: string;
    radiusKm?: string;
  }>({});

  useEffect(() => {
    if (areaToEdit) {
      setLocationName(areaToEdit.locationName || '');
      setRadiusKm(areaToEdit.radiusKm ? String(areaToEdit.radiusKm) : '50');
      if (areaToEdit.coordinates?.coordinates) {
        // Mongo GeoJSON: [longitude, latitude]
        setLongitude(String(areaToEdit.coordinates.coordinates[0]));
        setLatitude(String(areaToEdit.coordinates.coordinates[1]));
      } else {
        setLatitude(areaToEdit.latitude ? String(areaToEdit.latitude) : '');
        setLongitude(areaToEdit.longitude ? String(areaToEdit.longitude) : '');
      }
    } else {
      resetForm();
    }
    setErrors({});
  }, [areaToEdit, visible]);

  const resetForm = () => {
    setLocationName('');
    setLatitude('');
    setLongitude('');
    setRadiusKm('50');
    setErrors({});
  };

  const validate = (fields = { locationName, latitude, longitude, radiusKm }) => {
    const newErrors: Record<string, string> = {};

    if (!fields.locationName.trim()) {
      newErrors.locationName = 'Location address is required.';
    }

    const latNum = parseFloat(fields.latitude);
    if (!fields.latitude.trim()) {
      newErrors.latitude = 'Latitude is required.';
    } else if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      newErrors.latitude = 'Invalid (-90 to 90).';
    }

    const lngNum = parseFloat(fields.longitude);
    if (!fields.longitude.trim()) {
      newErrors.longitude = 'Longitude is required.';
    } else if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      newErrors.longitude = 'Invalid (-180 to 180).';
    }

    const radNum = parseFloat(fields.radiusKm);
    if (!fields.radiusKm.trim()) {
      newErrors.radiusKm = 'Radius is required.';
    } else if (isNaN(radNum) || radNum <= 0) {
      newErrors.radiusKm = 'Radius must be > 0 km.';
    }

    return newErrors;
  };

  const handleLocationNameChange = (val: string) => {
    setLocationName(val);
    if (errors.locationName) {
      setErrors(prev => ({
        ...prev,
        locationName: val.trim() ? undefined : 'Location address is required.',
      }));
    }
  };

  const handleLatitudeChange = (val: string) => {
    setLatitude(val);
    if (errors.latitude) {
      const lat = parseFloat(val);
      const err = !val.trim()
        ? 'Latitude is required.'
        : isNaN(lat) || lat < -90 || lat > 90
        ? 'Invalid (-90 to 90).'
        : undefined;
      setErrors(prev => ({ ...prev, latitude: err }));
    }
  };

  const handleLongitudeChange = (val: string) => {
    setLongitude(val);
    if (errors.longitude) {
      const lng = parseFloat(val);
      const err = !val.trim()
        ? 'Longitude is required.'
        : isNaN(lng) || lng < -180 || lng > 180
        ? 'Invalid (-180 to 180).'
        : undefined;
      setErrors(prev => ({ ...prev, longitude: err }));
    }
  };

  const handleRadiusChange = (val: string) => {
    setRadiusKm(val);
    if (errors.radiusKm) {
      const rad = parseFloat(val);
      const err = !val.trim()
        ? 'Radius is required.'
        : isNaN(rad) || rad <= 0
        ? 'Radius must be > 0 km.'
        : undefined;
      setErrors(prev => ({ ...prev, radiusKm: err }));
    }
  };

  const handleLocationSelect = (loc: LocationSelectResult) => {
    const newName = loc.address || locationName;
    const newLat = loc.latitude ? String(loc.latitude) : latitude;
    const newLng = loc.longitude ? String(loc.longitude) : longitude;

    if (loc.address) setLocationName(loc.address);
    if (loc.latitude) setLatitude(String(loc.latitude));
    if (loc.longitude) setLongitude(String(loc.longitude));

    setErrors(prev => ({
      ...prev,
      locationName: newName.trim() ? undefined : prev.locationName,
      latitude: newLat.trim() ? undefined : prev.latitude,
      longitude: newLng.trim() ? undefined : prev.longitude,
    }));
  };

  const handleSubmit = async () => {
    const valErrors = validate();
    setErrors(valErrors);

    if (Object.keys(valErrors).length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the highlighted errors before saving.',
      });
      return;
    }

    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    const radNum = parseFloat(radiusKm);

    setLoading(true);
    try {
      const payload = {
        locationName: locationName.trim(),
        latitude: latNum,
        longitude: lngNum,
        radiusKm: radNum,
      };

      let res: any;
      if (areaToEdit?._id) {
        res = await shipperService.updatePreferredArea(areaToEdit._id, payload);
      } else {
        res = await shipperService.addPreferredArea(payload);
      }

      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: areaToEdit
            ? 'Preferred area updated successfully.'
            : 'Preferred area added successfully.',
        });
        onSuccess();
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res?.message || 'Failed to save preferred area.',
        });
      }
    } catch (error: any) {
      console.error('Save Preferred Area Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to save preferred area.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Top Drag Handle Indicator */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.modalDragHandle} />
          </View>

          {/* Header */}
          <View style={styles.modalHeader}>
            <AppText style={styles.modalTitle}>
              {areaToEdit ? 'Edit Preferred Area' : 'Add New Preferred Area'}
            </AppText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Location Search / Picker */}
            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>Select Location</AppText>
              <LocationPicker
                value={locationName}
                placeholder="Search or pick location on map"
                onSelect={handleLocationSelect}
              />
            </View>

            {/* Location Address Text Field */}
            <Input
              label="Location Address"
              value={locationName}
              onChangeText={handleLocationNameChange}
              placeholder="e.g. Indore, Madhya Pradesh, India"
              leftIcon={<MapPin size={18} color={COLORS.primary} />}
              multiline
              inputContainerStyle={{ minHeight: 48, maxHeight: 80 }}
              error={errors.locationName}
            />

            {/* Latitude & Longitude Inputs */}
            <View style={styles.rowTwoCols}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Latitude"
                  value={latitude}
                  onChangeText={handleLatitudeChange}
                  placeholder="22.777927"
                  keyboardType="numeric"
                  maxLength={15}
                  leftIcon={<Compass size={16} color={COLORS.textSecondary} />}
                  error={errors.latitude}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Input
                  label="Longitude"
                  value={longitude}
                  onChangeText={handleLongitudeChange}
                  placeholder="75.892304"
                  keyboardType="numeric"
                  maxLength={15}
                  leftIcon={<Navigation size={16} color={COLORS.textSecondary} />}
                  error={errors.longitude}
                />
              </View>
            </View>

            {/* Radius Input & Presets */}
            <Input
              label="Radius (in kilometers)"
              value={radiusKm}
              onChangeText={handleRadiusChange}
              placeholder="50"
              keyboardType="numeric"
              rightIcon={
                <AppText style={{ fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.medium }}>
                  km
                </AppText>
              }
              error={errors.radiusKm}
            />

            {/* Quick Presets */}
            <View style={styles.presetSection}>
              <AppText style={styles.presetLabel}>Quick Presets</AppText>
              <View style={styles.presetRow}>
                {RADIUS_PRESETS.map(preset => {
                  const isActive = String(preset) === radiusKm;
                  return (
                    <TouchableOpacity
                      key={preset}
                      style={[
                        styles.presetChip,
                        isActive && styles.presetChipActive,
                      ]}
                      onPress={() => {
                        handleRadiusChange(String(preset));
                      }}
                      activeOpacity={0.7}
                    >
                      <AppText
                        style={[
                          styles.presetChipText,
                          isActive && styles.presetChipTextActive,
                        ]}
                      >
                        {preset} km
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
              activeOpacity={0.8}
            >
              <AppText style={styles.cancelBtnText}>Cancel</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <AppText style={styles.submitBtnText}>
                  {areaToEdit ? 'Update Area' : 'Save Area'}
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddEditAreaModal;
