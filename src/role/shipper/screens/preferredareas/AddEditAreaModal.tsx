import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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

const RADIUS_PRESETS = [25, 50, 75, 100, 150];

const AddEditAreaModal = ({ visible, onClose, onSuccess, areaToEdit }: Props) => {
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radiusKm, setRadiusKm] = useState('50');
  const [loading, setLoading] = useState(false);

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
  }, [areaToEdit, visible]);

  const resetForm = () => {
    setLocationName('');
    setLatitude('');
    setLongitude('');
    setRadiusKm('50');
  };

  const handleLocationSelect = (loc: LocationSelectResult) => {
    if (loc.address) setLocationName(loc.address);
    if (loc.latitude) setLatitude(String(loc.latitude));
    if (loc.longitude) setLongitude(String(loc.longitude));
  };

  const handleSubmit = async () => {
    if (!locationName.trim()) {
      Alert.alert('Validation Error', 'Please enter or select a location name.');
      return;
    }
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    const radNum = parseFloat(radiusKm);

    if (isNaN(latNum) || isNaN(lngNum)) {
      Alert.alert('Validation Error', 'Please enter valid latitude and longitude coordinates.');
      return;
    }
    if (isNaN(radNum) || radNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid radius in kilometers.');
      return;
    }

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
        Alert.alert(
          'Success',
          areaToEdit
            ? 'Preferred area updated successfully.'
            : 'Preferred area added successfully.',
        );
        onSuccess();
        onClose();
      } else {
        Alert.alert('Error', res?.message || 'Failed to save preferred area.');
      }
    } catch (error: any) {
      console.error('Save Preferred Area Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to save preferred area.',
      );
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
          {/* Header */}
          <View style={styles.modalHeader}>
            <AppText style={styles.modalTitle}>
              {areaToEdit ? 'Edit Preferred Area' : 'Add New Preferred Area'}
            </AppText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textPrimary} />
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
            <View style={{ marginBottom: SPACING.md }}>
              <Input
                label="Location Address"
                value={locationName}
                onChangeText={setLocationName}
                placeholder="e.g. Indore, Madhya Pradesh, India"
                leftIcon={<MapPin size={18} color={COLORS.goldPrimary} />}
                multiline
              />
            </View>

            {/* Latitude & Longitude Inputs */}
            <View style={styles.rowTwoCols}>
              <View style={{ flex: 1, marginBottom: SPACING.md }}>
                <Input
                  label="Latitude"
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="22.777927"
                  keyboardType="numeric"
                  leftIcon={<Compass size={16} color={COLORS.textSecondary} />}
                />
              </View>

              <View style={{ flex: 1, marginBottom: SPACING.md }}>
                <Input
                  label="Longitude"
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="75.892304"
                  keyboardType="numeric"
                  leftIcon={<Navigation size={16} color={COLORS.textSecondary} />}
                />
              </View>
            </View>

            {/* Radius Input & Presets */}
            <View style={{ marginBottom: SPACING.md }}>
              <Input
                label="Radius (in kilometers)"
                value={radiusKm}
                onChangeText={setRadiusKm}
                placeholder="50"
                keyboardType="numeric"
                rightIcon={
                  <AppText style={{ fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.medium }}>
                    km
                  </AppText>
                }
              />
            </View>

              {/* Radius Quick Presets */}
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
                      onPress={() => setRadiusKm(String(preset))}
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
          </ScrollView>

          {/* Modal Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <AppText style={styles.cancelBtnText}>Cancel</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
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
