import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { X, MapPin, Check } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import LocationPicker, { LocationSelectResult } from '../../../../components/common/LocationPicker/LocationPicker';
import shipperService from '../../../../api/services/shipperService';
import { useAppDispatch } from '../../../../hooks/redux';
import { updateUser } from '../../../../redux/slices/authSlice';
import styles from './styles.editprofilemodal';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profileData: any;
  user: any;
  onSuccess: (updatedData: any) => void;
}

const DEFAULT_LAT = 22.7195687;
const DEFAULT_LNG = 75.8577258;

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  profileData,
  user,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();

  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(DEFAULT_LAT);
  const [longitude, setLongitude] = useState<number>(DEFAULT_LNG);
  const [mobile, setMobile] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      const loc = profileData?.locale || {};
      setAddress(loc.address || 'Indore, Madhya Pradesh, India');
      setLatitude(typeof loc.latitude === 'number' ? loc.latitude : DEFAULT_LAT);
      setLongitude(typeof loc.longitude === 'number' ? loc.longitude : DEFAULT_LNG);
      setMobile(profileData?.mobile || user?.phoneNumber || '');
      setDescription(profileData?.description || '');
    }
  }, [visible, profileData, user]);

  const handleLocationSelect = (loc: LocationSelectResult) => {
    if (loc.address) setAddress(loc.address);
    if (loc.latitude) setLatitude(loc.latitude);
    if (loc.longitude) setLongitude(loc.longitude);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        mobile,
        description,
        locale: {
          address,
          latitude,
          longitude,
        },
      };

      const res = await shipperService.updateProfile(payload);
      if (res?.success || res?.data) {
        const updated = res.data || payload;
        dispatch(
          updateUser({
            phoneNumber: mobile,
          }),
        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message || 'Shipper profile updated successfully.',
        });
        onSuccess(updated);
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message || 'Failed to update profile.',
        });
      }
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to update profile.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const email = profileData?.email || user?.email || 'rupeshshipper@yopmail.com';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%' }}
          >
            <View style={styles.modalContainer}>
              {/* HEADER */}
              <View style={styles.header}>
                <AppText style={styles.title}>Edit Shipper Profile</AppText>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  activeOpacity={0.7}
                >
                  <X size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* SCROLLABLE FORM CONTENT */}
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* UPDATE LOCATION */}
                <View style={styles.fieldContainer}>
                  <AppText style={styles.fieldLabel}>UPDATE LOCATION</AppText>
                  <LocationPicker
                    value={address}
                    placeholder="Search location..."
                    onSelect={handleLocationSelect}
                  />

                  {/* MAP PREVIEW */}
                  <View style={styles.mapContainer}>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={styles.map}
                      region={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                    >
                      <Marker coordinate={{ latitude, longitude }} />
                    </MapView>
                  </View>
                </View>

                {/* PHONE NUMBER */}
                <View style={styles.fieldContainer}>
                  <AppText style={styles.fieldLabel}>PHONE NUMBER</AppText>
                  <View style={styles.phoneRow}>
                    <View style={styles.countryPicker}>
                      <AppText style={styles.countryFlag}>🇺🇸</AppText>
                      <AppText style={styles.countryText}>USA (+1)</AppText>
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      value={mobile}
                      onChangeText={setMobile}
                      placeholder="Phone number"
                      placeholderTextColor={COLORS.textSecondary}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* EMAIL & ACCOUNT TYPE ROW */}
                <View style={styles.row}>
                  <View style={styles.col}>
                    <AppText style={styles.fieldLabel}>EMAIL</AppText>
                    <TextInput
                      style={[styles.input, styles.disabledInput]}
                      value={email}
                      editable={false}
                    />
                  </View>
                  <View style={styles.col}>
                    <AppText style={styles.fieldLabel}>ACCOUNT TYPE</AppText>
                    <TextInput
                      style={[styles.input, styles.disabledInput]}
                      value="SHIPPER"
                      editable={false}
                    />
                  </View>
                </View>

                {/* DESCRIPTION */}
                <View style={styles.fieldContainer}>
                  <AppText style={styles.fieldLabel}>DESCRIPTION</AppText>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter description..."
                    placeholderTextColor={COLORS.textSecondary}
                    multiline
                    maxLength={500}
                  />
                  <AppText style={styles.charCounter}>
                    {description.length}/500
                  </AppText>
                </View>
              </ScrollView>

              {/* FOOTER ACTIONS */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  <X size={16} color={COLORS.textPrimary} />
                  <AppText style={styles.cancelBtnText}>Cancel</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSave}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Check size={16} color={COLORS.white} />
                      <AppText style={styles.saveBtnText}>Save</AppText>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditProfileModal;
