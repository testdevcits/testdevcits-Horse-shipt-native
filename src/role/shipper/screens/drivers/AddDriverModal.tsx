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
import { X, } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AppText, Input } from '../../../../components';
import { COLORS, SPACING, } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.adddriver';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  driverToEdit?: any;
}

const AddDriverModal = ({ visible, onClose, onSuccess, driverToEdit }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [_showPassword, _setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    licenseNumber?: string;
    password?: string;
  }>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (driverToEdit) {
      setName(driverToEdit.name || '');
      setEmail(driverToEdit.email || '');
      setPhone(driverToEdit.phone || '');
      setLicenseNumber(driverToEdit.licenseNumber || '');
      setNotes(driverToEdit.notes || '');
      setPassword('');
    } else {
      resetForm();
    }
  }, [driverToEdit, visible]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setLicenseNumber('');
    setPassword('');
    setNotes('');
  };

  const validateEmail = (emailStr: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(emailStr);
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter driver name.';
    }
    if (!email.trim() || !validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!phone.trim() || phone.trim().length < 8) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    if (!licenseNumber.trim()) {
      newErrors.licenseNumber = 'Please enter license number.';
    }
    if (!driverToEdit && (!password || password.length < 6)) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      let res: any;
      if (driverToEdit?._id) {
        res = await shipperService.updateDriver(driverToEdit._id, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          licenseNumber: licenseNumber.trim(),
          notes: notes.trim(),
        });
      } else {
        res = await shipperService.addDriver({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          licenseNumber: licenseNumber.trim(),
          password: password,
          notes: notes.trim(),
        });
      }

      if (res?.success || res?.data || res?.message === 'Data fetched successfully') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2:
            res?.message ||
            (driverToEdit
              ? 'Driver updated successfully'
              : 'Driver added successfully'),
        });
        resetForm();
        onSuccess();
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res?.message || 'Failed to save driver.',
        });
        setSubmitError(res?.message || 'Failed to save driver.');
      }
    } catch (error: any) {
      console.error('Save Driver Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to save driver details.',
      });
      setSubmitError(error?.message || 'Failed to save driver details.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <AppText style={styles.title}>Truck Driver Management</AppText>
                <AppText style={styles.subtitle}>
                  {driverToEdit ? 'Edit Driver' : 'Add Driver'} - Enter the driver's contact details and license information.
                </AppText>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Section 1: Contact Information */}
              <AppText style={styles.sectionHeader}>Contact Information</AppText>

              <Input
                label="Driver name *"
                placeholder="Enter Driver Name"
                value={name}
                onChangeText={text => {
                  setName(text);
                  if (errors?.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                error={errors?.name}
              />

              <Input
                label="Email address *"
                placeholder="Enter Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (errors?.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                error={errors?.email}
              />

              <Input
                label="Phone Number *"
                placeholder="Enter Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={text => {
                  setPhone(text);
                  if (errors?.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                error={errors?.phone}
              />

              {/* Section 2: License & Access */}
              <AppText style={[styles.sectionHeader, { marginTop: SPACING.md }]}>
                License & Access
              </AppText>

              <Input
                label="License number *"
                placeholder="Enter License Number"
                value={licenseNumber}
                onChangeText={text => {
                  setLicenseNumber(text);
                  if (errors?.licenseNumber) setErrors(prev => ({ ...prev, licenseNumber: '' }));
                }}
                error={errors?.licenseNumber}
              />

              {!driverToEdit && (
                <Input
                  label="Password *"
                  placeholder="Enter Password"
                  isPassword
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    if (errors?.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  error={errors?.password}
                />
              )}

              <Input
                label="Notes (General Info) *"
                placeholder="e.g. Authorized for long distance routes"
                value={notes}
                onChangeText={setNotes}
                multiline
              />


              {submitError && (
                <View style={styles.errorContainer}>
                  <AppText style={styles.errorText}>{submitError}</AppText>
                </View>
              )}

              {/* Action Buttons Row */}
              <View style={styles.buttonRow}>
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
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <AppText style={styles.submitBtnText}>
                      {driverToEdit ? 'Save Driver' : 'Add Driver'}
                    </AppText>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddDriverModal;
