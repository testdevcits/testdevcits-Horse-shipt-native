import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ChevronDown, ImagePlus, Compass, Check } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {
  AppHeader,
  AppText,
  Button as ButtonCompt,
  Input,
} from '../../../../components';
import { COLORS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.addvehicle';
import imageIndex from '../../../../assets/images/imageIndex';
import { isValidVehicleNumber, isValidVIN } from '../../../../utils/valiations';

interface Props {
  navigation?: any;
  route?: any;
  visible?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  vehicleToEdit?: any;
}

const VEHICLE_TYPES = ['Truck', 'Trailer', 'Other'];
const STALL_TYPES = [
  'Stock Trailer',
  'Slant Load',
  'Head to Head',
  'Semi',
  'Other',
];
const STALL_SIZES = ['Single Stall', 'Stall and a Half', 'Box Stall', 'Other'];

const AddVehicleModal: React.FC<Props> = ({
  navigation,
  route,
  visible,
  onClose,
  onSuccess,
  vehicleToEdit: propVehicleToEdit,
}) => {
  const vehicleToEdit = route?.params?.vehicleToEdit || propVehicleToEdit;

  console.log('AddVehicleModal vehicleToEdit:', vehicleToEdit);

  const handleClose = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else if (onClose) {
      onClose();
    }
  };

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPicking, setIsPicking] = useState(false);

  // Dropdown Picker States
  const [activePicker, setActivePicker] = useState<
    'vehicleType' | 'stallType' | 'stallSize' | null
  >(null);

  useEffect(() => {
    if (vehicleToEdit) {
      setTransportType(vehicleToEdit.transportType || 'Trucking');
      setVehicleType(vehicleToEdit.vehicleType || '');
      setVehicleNumber(vehicleToEdit.vehicleNumber || '');
      setVinNumber(vehicleToEdit.vinNumber || '');
      setNumberOfStalls(
        vehicleToEdit.numberOfStalls
          ? String(vehicleToEdit.numberOfStalls)
          : '',
      );
      setStallType(vehicleToEdit.trailerType || '');
      setStallSize(vehicleToEdit.stallSize || '');
      setNotes(vehicleToEdit.notes || '');
      if (vehicleToEdit.images?.[0]?.url) {
        setSelectedImage({ uri: vehicleToEdit.images[0].url });
      } else {
        setSelectedImage(null);
      }
    } else {
      resetForm();
    }
  }, [vehicleToEdit]);

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
    setErrors({});
    setIsPicking(false);
  };

  const handlePickImage = async () => {
    if (isPicking) return;

    setIsPicking(true);
    try {
      const image = await ImagePicker.openPicker({
        width: 1200,
        height: 800,
        cropping: false,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      if (image?.size && image.size > 1 * 1024 * 1024) {
        Toast.show({
          type: 'error',
          text1: 'File Too Large',
          text2: 'Selected vehicle image must be 1 MB or less.',
        });
        return;
      }

      if (image && image.path) {
        setSelectedImage({
          uri: image.path,
          type: image.mime || 'image/jpeg',
          name: image.path.split('/').pop() || 'vehicle_img.jpg',
        });
        if (errors.selectedImage) {
          setErrors(prev => ({ ...prev, selectedImage: '' }));
        }
      }
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        console.error('ImagePicker Error:', error);
      }
    } finally {
      setIsPicking(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!vehicleType) {
      newErrors.vehicleType = 'Please select a vehicle type.';
    }
    if (!vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Please enter a vehicle number.';
    } else if (!isValidVehicleNumber(vehicleNumber)) {
      newErrors.vehicleNumber = 'Please enter a valid vehicle number.';
    }
    // VIN is optional, but if entered it must be valid
    if (vinNumber.trim() && !isValidVIN(vinNumber)) {
      newErrors.vinNumber = 'Please enter a valid 17-character VIN.';
    }
    if (!numberOfStalls.trim()) {
      newErrors.numberOfStalls = 'Please enter number of stalls.';
    }
    if (!stallType) {
      newErrors.stallType = 'Please select a stall type.';
    }
    if (!stallSize) {
      newErrors.stallSize = 'Please select a stall size.';
    }
    if (!selectedImage && !vehicleToEdit) {
      newErrors.selectedImage = 'Please upload at least one vehicle image.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const formData = new FormData();
      formData?.append('transportType', transportType);
      formData?.append('vehicleType', vehicleType);
      formData?.append('vehicleNumber', vehicleNumber.trim());
      formData?.append('vinNumber', vinNumber.trim());
      formData?.append('trailerType', stallType);
      formData?.append('numberOfStalls', numberOfStalls.trim());
      formData?.append('stallSize', stallSize);
      formData?.append('notes', notes.trim());

      if (
        selectedImage &&
        selectedImage.uri &&
        !selectedImage.uri.startsWith('http')
      ) {
        formData?.append('images', {
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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2:
            res?.message ||
            (vehicleToEdit
              ? 'Vehicle updated successfully'
              : 'Vehicle added successfully'),
        });
        resetForm();
        if (onSuccess) onSuccess();
        handleClose();
      } else {
        setErrors(prev => ({
          ...prev,
          submit: res?.message || 'Failed to save vehicle.',
        }));
      }
    } catch (error: any) {
      console.error('Save Vehicle Error:', error);
      const errMsg =
        error?.message ||
        error?.response?.data?.message ||
        error?.raw?.message ||
        'Failed to save vehicle details.';
      setErrors(prev => ({ ...prev, submit: errMsg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        title={vehicleToEdit ? 'Edit Vehicle' : 'Add Vehicle'}
        showBack
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Vehicle Details Card Header */}
          <View style={styles.vehicleDetailsHeader}>
            <View style={styles.steeringIconBox}>
              <Compass size={22} color="#A06333" />
            </View>
            <View style={styles.headerTextCol}>
              <AppText style={styles.vehicleDetailsTitle}>
                Vehicle details
              </AppText>
              <AppText style={styles.vehicleDetailsSub}>
                Tell us about your vehicle(s) so we can match you with the right
                shipments.
              </AppText>
            </View>
          </View>

          {/* Form Fields */}
          <Input
            label="Transport Type *"
            placeholder="Trucking"
            value={transportType}
            onChangeText={setTransportType}
          />

          <View style={{ marginBottom: 12 }}>
            <AppText style={styles.label}>
              Vehicle Type <AppText style={styles.required}>*</AppText>
            </AppText>
            <TouchableOpacity
              style={[
                styles.dropdownInput,
                !!errors.vehicleType && { borderColor: COLORS.error },
              ]}
              onPress={() => setActivePicker('vehicleType')}
            >
              <AppText
                style={
                  vehicleType
                    ? styles.dropdownTextSelected
                    : styles.dropdownTextPlaceholder
                }
              >
                {vehicleType || 'Select vehicle type'}
              </AppText>
              <ChevronDown size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {!!errors.vehicleType && (
              <AppText style={styles.errorText}>{errors.vehicleType}</AppText>
            )}
          </View>

          <Input
            label="Vehicle Number *"
            placeholder="Enter Vehicle Number"
            value={vehicleNumber}
            error={errors.vehicleNumber}
            onChangeText={text => {
              setVehicleNumber(text);
              if (errors.vehicleNumber) {
                setErrors(prev => ({ ...prev, vehicleNumber: '' }));
              }
            }}
          />

          <Input
            label="VIN Number (Optional)"
            placeholder="Enter VIN Number"
            value={vinNumber}
            onChangeText={text => {
              setVinNumber(text);
              if (errors.vinNumber) {
                setErrors(prev => ({ ...prev, vinNumber: '' }));
              }
            }}
            onBlur={() => {
              if (vinNumber.trim() && !isValidVIN(vinNumber)) {
                setErrors(prev => ({
                  ...prev,
                  vinNumber: 'Please enter a valid 17-character VIN.',
                }));
              } else if (errors.vinNumber) {
                setErrors(prev => ({ ...prev, vinNumber: '' }));
              }
            }}
            error={errors.vinNumber}
          />

          <Input
            label="Number of stalls *"
            placeholder="Enter Number of stalls"
            keyboardType="numeric"
            value={numberOfStalls}
            error={errors.numberOfStalls}
            onChangeText={text => {
              setNumberOfStalls(text);
              if (errors.numberOfStalls) {
                setErrors(prev => ({ ...prev, numberOfStalls: '' }));
              }
            }}
            maxLength={2}
          />

          <View style={{ marginBottom: 12 }}>
            <AppText style={styles.label}>
              Stall Type <AppText style={styles.required}>*</AppText>
            </AppText>
            <TouchableOpacity
              style={[
                styles.dropdownInput,
                !!errors.stallType && { borderColor: COLORS.error },
              ]}
              onPress={() => setActivePicker('stallType')}
            >
              <AppText
                style={
                  stallType
                    ? styles.dropdownTextSelected
                    : styles.dropdownTextPlaceholder
                }
              >
                {stallType || 'Select Stall Type'}
              </AppText>
              <ChevronDown size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {!!errors.stallType && (
              <AppText style={styles.errorText}>{errors.stallType}</AppText>
            )}
          </View>

          <View style={{ marginBottom: 12 }}>
            <AppText style={styles.label}>
              Stall Size <AppText style={styles.required}>*</AppText>
            </AppText>
            <TouchableOpacity
              style={[
                styles.dropdownInput,
                !!errors.stallSize && { borderColor: COLORS.error },
              ]}
              onPress={() => setActivePicker('stallSize')}
            >
              <AppText
                style={
                  stallSize
                    ? styles.dropdownTextSelected
                    : styles.dropdownTextPlaceholder
                }
              >
                {stallSize || 'Select Stall Size'}
              </AppText>
              <ChevronDown size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {!!errors.stallSize && (
              <AppText style={styles.errorText}>{errors.stallSize}</AppText>
            )}
          </View>

          <View style={{ marginBottom: 12 }}>
            <AppText style={styles.label}>
              Upload Vehicle Images <AppText style={styles.required}>*</AppText>
            </AppText>
            <TouchableOpacity
              style={[
                styles.uploadDashedCard,
                !!errors.selectedImage && { borderColor: COLORS.error },
                isPicking && { opacity: 0.7 },
              ]}
              onPress={handlePickImage}
              activeOpacity={0.8}
              disabled={isPicking}
            >
              {isPicking ? (
                <View style={styles.uploadPlaceholder}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              ) : selectedImage ? (
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <ImagePlus size={36} color={COLORS.textSecondary} />
                </View>
              )}
            </TouchableOpacity>
            {!!errors.selectedImage && (
              <AppText style={styles.errorText}>{errors.selectedImage}</AppText>
            )}
          </View>

          <Input
            label="Notes (General Info)"
            placeholder="Enter Notes about vehicle specs, condition, etc..."
            multiline
            numberOfLines={4}
            value={notes}
            style={styles.textArea}
            onChangeText={setNotes}
          />

          {!!errors.submit && (
            <AppText
              style={[styles.errorText, { marginTop: 8, textAlign: 'center' }]}
            >
              {errors.submit}
            </AppText>
          )}

          {/* Bottom Action Buttons Row */}
          <View style={styles.buttonRow}>
            <ButtonCompt
              title="Cancel"
              onPress={handleClose}
              buttonStyle={styles.cancelBtn}
              textStyle={styles.cancelBtnText}
            />

            <ButtonCompt
              title={vehicleToEdit ? 'Save Vehicle' : 'Add Vehicle'}
              onPress={handleSubmit}
              isLoading={loading}
              buttonStyle={styles.addVehicleBtn}
              textStyle={styles.addVehicleBtnText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
                    if (errors.vehicleType) {
                      setErrors(prev => ({ ...prev, vehicleType: '' }));
                    }
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
                    if (errors.stallType) {
                      setErrors(prev => ({ ...prev, stallType: '' }));
                    }
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
                    if (errors.stallSize) {
                      setErrors(prev => ({ ...prev, stallSize: '' }));
                    }
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

      {/* Adding Vehicle Loading Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <View style={styles.truckIconContainer}>
              <Image
                source={imageIndex.runningtruck}
                style={{
                  width: 200,
                  height: 200,
                }}
                resizeMode="contain"
              />
            </View>

            <AppText style={styles.loadingTitle}>Saving Vehicle</AppText>
            <AppText style={styles.loadingSubtitle}>
              Registering your vehicle... Please wait while we save the
              information.
            </AppText>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddVehicleModal;
