import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  AppHeader,
  Button,
  Input,
  CountryCodePicker,
  COUNTRIES,
} from '../../../../../components';
import { Country } from '../../../../../components/common/CountryCodePicker/CountryCodePicker';
import { COLORS, SPACING } from '../../../../../constants';
import customerService from '../../../../../api/services/customerService';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { updateUser } from '../../../../../redux/slices/authSlice';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';

interface CustomerEditProfileScreenProps {
  navigation: any;
  route: any;
}

const CustomerEditProfileScreen: React.FC<CustomerEditProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.auth);

  const profileData = useMemo(
    () => route?.params?.profileData || {},
    [route?.params?.profileData],
  );

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [mobile, setMobile] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fName = profileData?.firstName || user?.firstName || '';
    const lName = profileData?.lastName || user?.lastName || '';
    const mail = profileData?.email || user?.email || '';
    const rawMobile =
      profileData?.phone || (user as any)?.phone || user?.phoneNumber || '';

    setFirstName(fName);
    setLastName(lName);
    setEmail(mail);

    const matched = COUNTRIES.find((c: any) => rawMobile.startsWith(c.code));
    if (matched) {
      setSelectedCountry(matched);
      setMobile(rawMobile.slice(matched.code.length).trim());
    } else {
      setMobile(rawMobile);
    }
  }, [profileData, user]);

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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: formattedMobile,
      };

      const res = await customerService.updateProfile(payload);
      if (res?.success || res?.data) {
        dispatch(
          updateUser({
            name: `${firstName} ${lastName}`.trim(),
            phoneNumber: formattedMobile,
          }),
        );

        showSuccessToast('Success', 'Profile updated successfully.');

        if (route?.params?.onSuccess) {
          route.params.onSuccess(res.data || payload);
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

  return (
    <View style={styles.container}>
      <AppHeader
        title="Personal Info"
        showBack={true}
        showProfileImage={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. FIRST NAME & LAST NAME */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Input
                label="FIRST NAME"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
              />
            </View>
            <View style={styles.col}>
              <Input
                label="LAST NAME"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
              />
            </View>
          </View>

          {/* 2. EMAIL ADDRESS & ACCOUNT TYPE */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Input
                label="EMAIL ADDRESS"
                value={email || 'Not Available'}
                disabled
                editable={false}
              />
            </View>
            <View style={styles.col}>
              <Input
                label="ACCOUNT TYPE"
                value="VERIFIED CUSTOMER"
                disabled
                editable={false}
              />
            </View>
          </View>

          {/* 3. PHONE NUMBER */}
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
                  onSelectCountry={(c: any) => setSelectedCountry(c)}
                  showBorder={false}
                />
              }
            />
          </View>
        </ScrollView>

        {/* BOTTOM SAVE BUTTON */}
        <View style={styles.footer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            isLoading={saving}
            disabled={saving}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  col: {
    flex: 1,
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default CustomerEditProfileScreen;
