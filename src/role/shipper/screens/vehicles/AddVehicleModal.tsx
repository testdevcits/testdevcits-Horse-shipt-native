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
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.addvehicle';

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

export default AddVehicleModal;
