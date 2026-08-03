import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Eye, EyeOff } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AppText, Input } from '../../../../components';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter driver name.',
      });
      return;
    }
    if (!email.trim() || !validateEmail(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid email address.',
      });
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid phone number.',
      });
      return;
    }
    if (!licenseNumber.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter license number.',
      });
      return;
    }
    if (!driverToEdit && (!password || password.length < 6)) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Password must be at least 6 characters.',
      });
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
      }
    } catch (error: any) {
      console.error('Save Driver Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to save driver details.',
      });
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
                onChangeText={setName}
              />

              <Input
                label="Email address *"
                placeholder="Enter Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Input
                label="Phone Number *"
                placeholder="Enter Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              {/* Section 2: License & Access */}
              <AppText style={[styles.sectionHeader, { marginTop: SPACING.md }]}>
                License & Access
              </AppText>

              <Input
                label="License number *"
                placeholder="Enter License Number"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />

              {!driverToEdit && (
                <Input
                  label="Password *"
                  placeholder="Enter Password"
                  isPassword
                  value={password}
                  onChangeText={setPassword}
                />
              )}

              <Input
                label="Notes (General Info) *"
                placeholder="e.g. Authorized for long distance routes"
                value={notes}
                onChangeText={setNotes}
                multiline
              />

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
