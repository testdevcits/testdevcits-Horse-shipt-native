import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  AppHeader,
  AppText,
  Button,
  Input,
  CountryCodePicker,
  COUNTRIES,
} from '../../../../../components';
import { Country } from '../../../../../components/common/CountryCodePicker/CountryCodePicker';
import { SPACING } from '../../../../../constants';
import LocationPicker, {
  LocationSelectResult,
} from '../../../../../components/common/LocationPicker/LocationPicker';
import shipperService from '../../../../../api/services/shipperService';
import { useAppDispatch } from '../../../../../hooks/redux';
import { updateUser } from '../../../../../redux/slices/authSlice';
import styles from './styles.Editprofilescreen';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';

interface EditProfileScreenProps {
  navigation: any;
  route: any;
}

const DEFAULT_LAT = 22.7195687;
const DEFAULT_LNG = 75.8577258;

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const profileData = useMemo(
    () => route?.params?.profileData || {},
    [route?.params?.profileData],
  );
  const user = useMemo(() => route?.params?.user || {}, [route?.params?.user]);

  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(DEFAULT_LAT);
  const [longitude, setLongitude] = useState<number>(DEFAULT_LNG);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES[1] || COUNTRIES[0],
  );
  const [mobile, setMobile] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const loc = profileData?.locale || {};
    setAddress(loc?.address || 'Not Available');
    setLatitude(
      typeof loc?.latitude === 'number' ? loc?.latitude : DEFAULT_LAT,
    );
    setLongitude(
      typeof loc?.longitude === 'number' ? loc?.longitude : DEFAULT_LNG,
    );
    const rawMobile = profileData?.mobile || user?.phoneNumber || '';
    const matched = COUNTRIES.find(c => rawMobile.startsWith(c.code));
    if (matched) {
      setSelectedCountry(matched);
      setMobile(rawMobile.slice(matched.code.length).trim());
    } else {
      setMobile(rawMobile);
    }
    setDescription(profileData?.description || '');
  }, [profileData, user]);

  const handleLocationSelect = (loc: LocationSelectResult) => {
    if (loc?.address) setAddress(loc?.address);
    if (loc?.latitude) setLatitude(loc?.latitude);
    if (loc?.longitude) setLongitude(loc?.longitude);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const cleanNum = mobile.trim();
      const formattedMobile = cleanNum
        ? cleanNum.startsWith('+')
          ? cleanNum
          : `${selectedCountry.code}${cleanNum}`
        : '';

      const payload = {
        mobile: formattedMobile,
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
            phoneNumber: formattedMobile,
          }),
        );

        showSuccessToast(
          'Success',
          res.message || 'Shipper profile updated successfully.',
        );

        if (route?.params?.onSuccess) {
          route.params.onSuccess(updated);
        }
        navigation.goBack();
      } else {
        showErrorToast('Error', res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update profile.';
      showErrorToast('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const email = profileData?.email || user?.email || 'Not available';

  return (
    <View style={styles.container}>
      <AppHeader title="Edit Profile" showBack showProfileImage={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. EMAIL & ACCOUNT TYPE ROW */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Input
                label="EMAIL ADDRESS"
                value={email}
                disabled
                editable={false}
              />
            </View>
            <View style={styles.col}>
              <Input
                label="ACCOUNT TYPE"
                value="VERIFIED SHIPPER"
                disabled
                editable={false}
              />
            </View>
          </View>

          {/* 2. PHONE NUMBER */}
          <View style={{ marginBottom: SPACING.md }}>
            <Input
              label="PHONE NUMBER"
              value={mobile}
              onChangeText={setMobile}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              leftIcon={
                <CountryCodePicker
                  selectedCountry={selectedCountry}
                  onSelectCountry={c => setSelectedCountry(c)}
                  showBorder={false}
                />
              }
            />
          </View>

          {/* 3. DESCRIPTION / BIO */}
          <View style={{ marginBottom: SPACING.md }}>
            <Input
              label="DESCRIPTION / BIO"
              value={description}
              onChangeText={setDescription}
              placeholder="Tell horse owners about your transport service & experience..."
              multiline
              maxLength={500}
              inputContainerStyle={{ minHeight: 90 }}
              rightIcon={
                <AppText style={styles.charCounter}>
                  {description?.length}/500
                </AppText>
              }
            />
          </View>

          {/* 4. OPERATING LOCATION & MAP PREVIEW (Right above Save button) */}
          <View style={styles.fieldContainer}>
            <AppText style={styles.fieldLabel}>OPERATING LOCATION</AppText>
            <LocationPicker
              value={address}
              placeholder="Search operating location..."
              onSelect={handleLocationSelect}
            />

            {/* MAP PREVIEW CARD */}
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
        </ScrollView>

        {/* FOOTER ACTIONS */}
        <View style={styles.footer}>
          <Button
            title="Save Profile"
            onPress={handleSave}
            disabled={saving}
            isLoading={saving}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfileScreen;
