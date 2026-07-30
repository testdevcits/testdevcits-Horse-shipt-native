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
import { AppText } from '../../../../components';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';

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
      Alert.alert('Validation Error', 'Please enter driver name.');
      return;
    }
    if (!email.trim() || !validateEmail(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return;
    }
    if (!licenseNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter license number.');
      return;
    }
    if (!driverToEdit && (!password || password.length < 6)) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
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
        Alert.alert(
          'Success',
          res?.message ||
            (driverToEdit
              ? 'Driver updated successfully'
              : 'Driver added successfully'),
        );
        resetForm();
        onSuccess();
        onClose();
      } else {
        Alert.alert('Error', res?.message || 'Failed to save driver.');
      }
    } catch (error: any) {
      console.error('Save Driver Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to save driver details.',
      );
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

              <AppText style={styles.label}>
                Driver name <AppText style={styles.required}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                placeholder="Enter Driver Name"
                placeholderTextColor={COLORS.textLight}
                value={name}
                onChangeText={setName}
              />

              <AppText style={styles.label}>
                Email address <AppText style={styles.required}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                placeholder="Enter Email address"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <AppText style={styles.label}>
                Phone Number <AppText style={styles.required}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              {/* Section 2: License & Access */}
              <AppText style={[styles.sectionHeader, { marginTop: SPACING.md }]}>
                License & Access
              </AppText>

              <AppText style={styles.label}>
                License number <AppText style={styles.required}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                placeholder="Enter License Number"
                placeholderTextColor={COLORS.textLight}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />

              {!driverToEdit && (
                <>
                  <AppText style={styles.label}>
                    Password <AppText style={styles.required}>*</AppText>
                  </AppText>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter Password"
                      placeholderTextColor={COLORS.textLight}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeBtn}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color={COLORS.textSecondary} />
                      ) : (
                        <Eye size={18} color={COLORS.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <AppText style={styles.label}>
                Notes (General Info) <AppText style={styles.required}>*</AppText>
              </AppText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter Notes about driver experience, background, etc..."
                placeholderTextColor={COLORS.textLight}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.md,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    maxWidth: '90%',
  },
  closeBtn: {
    padding: 4,
  },
  sectionHeader: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: 4,
    marginTop: SPACING.xs,
  },
  required: {
    color: '#EF4444',
    fontFamily: FONTS.bold,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    backgroundColor: '#FAFAFA',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    backgroundColor: '#FAFAFA',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  eyeBtn: {
    paddingHorizontal: SPACING.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
  },
  cancelBtnText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  submitBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xs,
    backgroundColor: '#A06333',
    alignItems: 'center',
  },
  submitBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});

export default AddDriverModal;
