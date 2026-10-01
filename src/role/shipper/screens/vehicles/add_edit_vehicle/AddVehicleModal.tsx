import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {
  AppHeader,
  AppText,
  Button as ButtonCompt,
} from '../../../../../components';
import shipperService from '../../../../../api/services/shipperService';
import styles from './styles.addvehicle';
import {
  isValidVehicleNumber,
  isValidVIN,
} from '../../../../../utils/valiations';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';
import { VehiclePickerModal } from './components/VehiclePickerModal';
import { VehicleLoadingModal } from './components/VehicleLoadingModal';
import { VehicleFormFields } from './components/VehicleFormFields';

interface Props {
  navigation?: any;
  route?: any;
  visible?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  vehicleToEdit?: any;
}

const AddVehicleModal: React.FC<Props> = ({
  navigation,
  route,
  onClose,
  onSuccess,
  vehicleToEdit: propVehicleToEdit,
}) => {
  const vehicleToEdit = route?.params?.vehicleToEdit || propVehicleToEdit;

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
        showErrorToast(
          'File Too Large',
          'Selected vehicle image must be 1 MB or less.',
        );
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
        showSuccessToast(
          'Success',
          res?.message ||
            (vehicleToEdit
              ? 'Vehicle updated successfully'
              : 'Vehicle added successfully'),
        );
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
          <VehicleFormFields
            transportType={transportType}
            setTransportType={setTransportType}
            vehicleType={vehicleType}
            vehicleNumber={vehicleNumber}
            setVehicleNumber={setVehicleNumber}
            vinNumber={vinNumber}
            setVinNumber={setVinNumber}
            numberOfStalls={numberOfStalls}
            setNumberOfStalls={setNumberOfStalls}
            stallType={stallType}
            stallSize={stallSize}
            notes={notes}
            setNotes={setNotes}
            selectedImage={selectedImage}
            errors={errors}
            setErrors={setErrors}
            isPicking={isPicking}
            handlePickImage={handlePickImage}
            setActivePicker={setActivePicker}
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
      <VehiclePickerModal
        activePicker={activePicker}
        onClose={() => setActivePicker(null)}
        vehicleType={vehicleType}
        stallType={stallType}
        stallSize={stallSize}
        onSelectVehicleType={item => {
          setVehicleType(item);
          if (errors.vehicleType) {
            setErrors(prev => ({ ...prev, vehicleType: '' }));
          }
          setActivePicker(null);
        }}
        onSelectStallType={item => {
          setStallType(item);
          if (errors.stallType) {
            setErrors(prev => ({ ...prev, stallType: '' }));
          }
          setActivePicker(null);
        }}
        onSelectStallSize={item => {
          setStallSize(item);
          if (errors.stallSize) {
            setErrors(prev => ({ ...prev, stallSize: '' }));
          }
          setActivePicker(null);
        }}
      />

      {/* Adding Vehicle Loading Modal */}
      <VehicleLoadingModal loading={loading} />
    </View>
  );
};

export default AddVehicleModal;
