import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  X,
  ChevronDown,
  ImagePlus,
  Compass,
  Truck,
  Check,
} from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { AppText } from '../../../../components';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicleToEdit?: any;
}

const VEHICLE_TYPES = ['Truck', 'Trailer', 'Gooseneck', 'Bumper Pull'];
const STALL_TYPES = ['Slant Load', 'Straight Load', 'Box Stall', 'Head to Head'];
const STALL_SIZES = ['Single Stall', 'Double Stall', 'Box Stall', 'XL Stall'];

const AddVehicleModal = ({ visible, onClose, onSuccess, vehicleToEdit }: Props) => {
  const [transportType, setTransportType] = useState('Trucking');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [numberOfStalls, setNumberOfStalls] = useState('');
  const [stallType, setStallType] = useState('');
  const [stallSize, setStallSize] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Dropdown Picker States
  const [activePicker, setActivePicker] = useState<'vehicleType' | 'stallType' | 'stallSize' | null>(null);

  useEffect(() => {
    if (vehicleToEdit) {
      setTransportType(vehicleToEdit.transportType || 'Trucking');
      setVehicleType(vehicleToEdit.vehicleType || 'Truck');
      setVehicleNumber(vehicleToEdit.vehicleNumber || '');
      setVinNumber(vehicleToEdit.vinNumber || '');
      setNumberOfStalls(vehicleToEdit.numberOfStalls ? String(vehicleToEdit.numberOfStalls) : '10');
      setStallType(vehicleToEdit.trailerType || 'Slant Load');
      setStallSize(vehicleToEdit.stallSize || 'Single Stall');
      setNotes(vehicleToEdit.notes || '');
      if (vehicleToEdit.images && vehicleToEdit.images[0]?.url) {
        setSelectedImage({ uri: vehicleToEdit.images[0].url });
      } else {
        setSelectedImage(null);
      }
    } else {
      resetForm();
    }
  }, [vehicleToEdit, visible]);

  const resetForm = () => {
    setTransportType('Trucking');
    setVehicleType('');
    setVehicleNumber('');
    setVinNumber('');
    setNumberOfStalls('');
    setStallType('');
    setStallSize('');
    setNotes('');
    setSelectedImage(null);
  };

  const handlePickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1200,
        height: 800,
        cropping: false,
        mediaType: 'photo',
      });
      if (image && image.path) {
        setSelectedImage({
          uri: image.path,
          type: image.mime || 'image/jpeg',
          name: image.path.split('/').pop() || 'vehicle_img.jpg',
        });
      }
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        console.error('ImagePicker Error:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!vehicleType) {
      Alert.alert('Validation Error', 'Please select a vehicle type.');
      return;
    }
    if (!vehicleNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter a vehicle number.');
      return;
    }
    if (!numberOfStalls.trim()) {
      Alert.alert('Validation Error', 'Please enter number of stalls.');
      return;
    }
    if (!stallType) {
      Alert.alert('Validation Error', 'Please select a stall type.');
      return;
    }
    if (!stallSize) {
      Alert.alert('Validation Error', 'Please select a stall size.');
      return;
    }
    if (!selectedImage && !vehicleToEdit) {
      Alert.alert('Validation Error', 'Please upload at least one vehicle image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('transportType', transportType);
      formData.append('vehicleType', vehicleType);
      formData.append('vehicleNumber', vehicleNumber.trim());
      formData.append('vinNumber', vinNumber.trim());
      formData.append('trailerType', stallType);
      formData.append('numberOfStalls', numberOfStalls.trim());
      formData.append('stallSize', stallSize);
      formData.append('notes', notes.trim());

      if (selectedImage && selectedImage.uri && !selectedImage.uri.startsWith('http')) {
        formData.append('images', {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.name || 'vehicle.jpg',
        } as any);
      }

      let res: any;
      if (vehicleToEdit?._id) {
        res = await shipperService.updateVehicle(vehicleToEdit._id, formData);
      } else {
        res = await shipperService.addVehicle(formData);
      }

      if (res?.success || res?.vehicle || res?.data?.success) {
        Alert.alert(
          'Success',
          res?.message ||
            (vehicleToEdit
              ? 'Vehicle updated successfully'
              : 'Vehicle added successfully'),
        );
        resetForm();
        onSuccess();
        onClose();
      } else {
        Alert.alert('Error', res?.message || 'Failed to save vehicle.');
      }
    } catch (error: any) {
      console.error('Save Vehicle Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to save vehicle details.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal visible={visible && !loading} transparent animationType="slide">
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.modalContent}>
              {/* Header Title */}
              <View style={styles.header}>
                <AppText style={styles.title}>
                  {vehicleToEdit ? 'Edit Vehicle' : 'Add a New Vehicle'}
                </AppText>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Vehicle Details Card Header */}
                <View style={styles.vehicleDetailsHeader}>
                  <View style={styles.steeringIconBox}>
                    <Compass size={22} color="#A06333" />
                  </View>
                  <View style={styles.headerTextCol}>
                    <AppText style={styles.vehicleDetailsTitle}>Vehicle details</AppText>
                    <AppText style={styles.vehicleDetailsSub}>
                      Tell us about your vehicle(s) so we can match you with the right shipments.
                    </AppText>
                  </View>
                </View>

                {/* Form Fields */}
                <AppText style={styles.label}>
                  Transport Type <AppText style={styles.required}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  placeholder="Trucking"
                  placeholderTextColor={COLORS.textLight}
                  value={transportType}
                  onChangeText={setTransportType}
                />

                <AppText style={styles.label}>
                  Vehicle Type <AppText style={styles.required}>*</AppText>
                </AppText>
                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setActivePicker('vehicleType')}
                >
                  <AppText
                    style={
                      vehicleType ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder
                    }
                  >
                    {vehicleType || 'Select vehicle type'}
                  </AppText>
                  <ChevronDown size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <AppText style={styles.label}>
                  Vehicle Number <AppText style={styles.required}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Vehicle Number"
                  placeholderTextColor={COLORS.textLight}
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                />

                <AppText style={styles.label}>
                  VIN Number (Optional) <AppText style={styles.required}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter VIN Number"
                  placeholderTextColor={COLORS.textLight}
                  value={vinNumber}
                  onChangeText={setVinNumber}
                />

                <AppText style={styles.label}>
                  Number of stalls <AppText style={styles.required}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Number of stalls"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="numeric"
                  value={numberOfStalls}
                  onChangeText={setNumberOfStalls}
                />

                <AppText style={styles.label}>
                  Stall Type <AppText style={styles.required}>*</AppText>
                </AppText>
                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setActivePicker('stallType')}
                >
                  <AppText
                    style={
                      stallType ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder
                    }
                  >
                    {stallType || 'Select Stall Type'}
                  </AppText>
                  <ChevronDown size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <AppText style={styles.label}>
                  Stall Size <AppText style={styles.required}>*</AppText>
                </AppText>
                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setActivePicker('stallSize')}
                >
                  <AppText
                    style={
                      stallSize ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder
                    }
                  >
                    {stallSize || 'Select Stall Size'}
                  </AppText>
                  <ChevronDown size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <AppText style={styles.label}>
                  Upload Vehicle Images <AppText style={styles.required}>*</AppText>
                </AppText>
                <TouchableOpacity
                  style={styles.uploadDashedCard}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  {selectedImage ? (
                    <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <ImagePlus size={36} color={COLORS.textSecondary} />
                    </View>
                  )}
                </TouchableOpacity>

                <AppText style={styles.label}>
                  Notes (General Info) <AppText style={styles.required}>*</AppText>
                </AppText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter Notes about vehicle specs, condition, etc..."
                  placeholderTextColor={COLORS.textLight}
                  multiline
                  numberOfLines={4}
                  value={notes}
                  onChangeText={setNotes}
                />

                {/* Bottom Action Buttons Row */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <AppText style={styles.cancelBtnText}>Cancel</AppText>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.addVehicleBtn} onPress={handleSubmit}>
                    <AppText style={styles.addVehicleBtnText}>
                      {vehicleToEdit ? 'Save Vehicle' : 'Add Vehicle'}
                    </AppText>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Select Picker Bottom Sheet Modal */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.pickerContent}>
            <AppText style={styles.pickerTitle}>
              {activePicker === 'vehicleType'
                ? 'Select Vehicle Type'
                : activePicker === 'stallType'
                ? 'Select Stall Type'
                : 'Select Stall Size'}
            </AppText>

            {activePicker === 'vehicleType' &&
              VEHICLE_TYPES.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.pickerItem}
                  onPress={() => {
                    setVehicleType(item);
                    setActivePicker(null);
                  }}
                >
                  <AppText
                    style={[
                      styles.pickerItemText,
                      vehicleType === item && styles.pickerItemTextActive,
                    ]}
                  >
                    {item}
                  </AppText>
                  {vehicleType === item && <Check size={18} color="#A06333" />}
                </TouchableOpacity>
              ))}

            {activePicker === 'stallType' &&
              STALL_TYPES.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.pickerItem}
                  onPress={() => {
                    setStallType(item);
                    setActivePicker(null);
                  }}
                >
                  <AppText
                    style={[
                      styles.pickerItemText,
                      stallType === item && styles.pickerItemTextActive,
                    ]}
                  >
                    {item}
                  </AppText>
                  {stallType === item && <Check size={18} color="#A06333" />}
                </TouchableOpacity>
              ))}

            {activePicker === 'stallSize' &&
              STALL_SIZES.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.pickerItem}
                  onPress={() => {
                    setStallSize(item);
                    setActivePicker(null);
                  }}
                >
                  <AppText
                    style={[
                      styles.pickerItemText,
                      stallSize === item && styles.pickerItemTextActive,
                    ]}
                  >
                    {item}
                  </AppText>
                  {stallSize === item && <Check size={18} color="#A06333" />}
                </TouchableOpacity>
              ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Adding Vehicle Loading Modal Popover (Matching Image 2) */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <View style={styles.truckIconContainer}>
              <Truck size={44} color={COLORS.textPrimary} strokeWidth={1.8} />
              <ActivityIndicator
                size="large"
                color="#A06333"
                style={styles.truckSpinner}
              />
            </View>

            <AppText style={styles.loadingTitle}>Adding Vehicle</AppText>
            <AppText style={styles.loadingSubtitle}>
              Registering your vehicle... Please wait while we save the information.
            </AppText>
          </View>
        </View>
      </Modal>
    </>
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
    maxHeight: '92%',
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
    alignItems: 'center',
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
  closeBtn: {
    padding: 4,
  },

  // Vehicle Details Card Header
  vehicleDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  steeringIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FBF5EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  vehicleDetailsTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  vehicleDetailsSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
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
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 11,
    backgroundColor: '#FAFAFA',
  },
  dropdownTextSelected: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  dropdownTextPlaceholder: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  uploadDashedCard: {
    height: 120,
    backgroundColor: '#FAFAFA',
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },

  // Action Buttons Row
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
  addVehicleBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xs,
    backgroundColor: '#A06333',
    alignItems: 'center',
  },
  addVehicleBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },

  // Picker Sheet Modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  pickerTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  pickerItemTextActive: {
    color: '#A06333',
    fontFamily: FONTS.bold,
  },

  // Adding Vehicle Loading Overlay (Image 2)
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  loadingCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  truckIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: SPACING.md,
  },
  truckSpinner: {
    position: 'absolute',
  },
  loadingTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  loadingSubtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AddVehicleModal;
