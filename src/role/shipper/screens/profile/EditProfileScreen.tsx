import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import { AppHeader, AppText, Button, Input } from '../../../../components';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../../constants';
import LocationPicker, { LocationSelectResult } from '../../../../components/common/LocationPicker/LocationPicker';
import shipperService from '../../../../api/services/shipperService';
import { useAppDispatch } from '../../../../hooks/redux';
import { updateUser } from '../../../../redux/slices/authSlice';

interface EditProfileScreenProps {
  navigation: any;
  route: any;
}

const DEFAULT_LAT = 22.7195687;
const DEFAULT_LNG = 75.8577258;

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const profileData = route?.params?.profileData || {};
  const user = route?.params?.user || {};

  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(DEFAULT_LAT);
  const [longitude, setLongitude] = useState<number>(DEFAULT_LNG);
  const [mobile, setMobile] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const loc = profileData?.locale || {};
    setAddress(loc.address || 'Not Available');
    setLatitude(typeof loc.latitude === 'number' ? loc.latitude : DEFAULT_LAT);
    setLongitude(typeof loc.longitude === 'number' ? loc.longitude : DEFAULT_LNG);
    setMobile(profileData?.mobile || user?.phoneNumber || '');
    setDescription(profileData?.description || '');
  }, [profileData, user]);

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

        if (route?.params?.onSuccess) {
          route.params.onSuccess(updated);
        }
        navigation.goBack();
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
          {/* UPDATE LOCATION SECTION */}
          <View style={styles.fieldContainer}>
            <AppText style={styles.fieldLabel}>LOCATION</AppText>
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
          <View style={{ marginBottom: SPACING.md }}>
            <Input
              label="PHONE NUMBER"
              value={mobile}
              onChangeText={setMobile}
              placeholder="Phone number"
              keyboardType="phone-pad"
              leftIcon={
                <View style={styles.phonePrefix}>
                  <AppText style={{ fontSize: FONT_SIZE.md }}>🇺🇸</AppText>
                  <AppText style={{
                    fontSize: FONT_SIZE.sm,
                    color: COLORS.textSecondary, fontFamily: FONTS.medium
                  }}>
                    +1
                  </AppText>
                </View>
              }
            />
          </View>

          {/* EMAIL & ACCOUNT TYPE ROW */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Input
                label="EMAIL"
                value={email}
                disabled
                editable={false}
              />
            </View>
            <View style={styles.col}>
              <Input
                label="ACCOUNT TYPE"
                value="SHIPPER"
                disabled
                editable={false}
              />
            </View>
          </View>

          {/* DESCRIPTION */}
          <View style={{ marginBottom: SPACING.lg }}>
            <Input
              label="DESCRIPTION"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description..."
              multiline
              maxLength={500}
              inputContainerStyle={{ minHeight: 90 }}
              rightIcon={
                <AppText style={styles.charCounter}>
                  {description.length}/500
                </AppText>
              }
            />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  mapContainer: {
    height: 160,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  col: {
    flex: 1,
  },
  charCounter: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});

export default EditProfileScreen;
