import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { pick } from '@react-native-documents/picker';
import { StepSchemas } from './validation';
import customerService from '../../../../api/services/customerService';
import { useNavigation } from '@react-navigation/native';

export const STEPS = ['Pickup', 'Delivery', 'Horses', 'Documents', 'Review'];

const useNewShipment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);
  const navigation = useNavigation();

  // 1. Initial State Definition
  const [form, setForm] = useState({
    pickupLocation: '',
    pickupLat: 0,
    pickupLng: 0,
    pickupTimeOption: 'between',
    pickupStartDate: new Date(),
    pickupEndDate: new Date(),

    deliveryLocation: '',
    deliveryLat: 0,
    deliveryLng: 0,
    deliveryTimeOption: 'between',
    deliveryStartDate: new Date(),
    deliveryEndDate: new Date(),

    numberOfHorses: 1,
    additionalInfo: '',
    recipientEmail: '',

    // Horse structure matches the backend requirements
    horses: [
      {
        registeredName: '',
        barnName: '',
        breed: 'English TB',
        otherBreed: '',
        colour: '',
        age: '',
        sex: 'Stallion',
        stallType: 'Box',
        size: '',
        generalInfo: '',
        notes: '',
        photo: null as any,
        coggins: null as any,
        healthCert: null as any,
      },
    ],
  });

  // 2. Logic to sync horse array when number of horses changes
  const updateForm = useCallback((updates: any) => {
    setForm(prev => {
      const newState = { ...prev, ...updates };

      // If numberOfHorses changed, adjust the horses array length
      if (updates.numberOfHorses !== undefined) {
        const targetCount = parseInt(updates.numberOfHorses) || 1;
        let updatedHorses = [...newState.horses];

        if (targetCount > updatedHorses.length) {
          const diff = targetCount - updatedHorses.length;
          for (let i = 0; i < diff; i++) {
            updatedHorses.push({
              registeredName: '',
              barnName: '',
              breed: 'English TB',
              otherBreed: '',
              colour: '',
              age: '',
              sex: 'Stallion',
              stallType: 'Box',
              size: '',
              generalInfo: '',
              notes: '',
              photo: null,
              coggins: null,
              healthCert: null,
            });
          }
        } else if (targetCount < updatedHorses.length) {
          updatedHorses = updatedHorses.slice(0, targetCount);
        }
        newState.horses = updatedHorses;
      }
      return newState;
    });
    setErrors({});
  }, []);

  // 3. Navigation and Validation
  const validateCurrentStep = async () => {
    try {
      if (StepSchemas[currentStep]) {
        await StepSchemas[currentStep].validate(form, { abortEarly: false });
      }
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: any = {};
      err.inner?.forEach((error: any) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  // 4. File Picking Logic
  const pickImage = async (index: number) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        includeBase64: false,
      });

      const updatedHorses = [...form.horses];
      updatedHorses[index].photo = {
        uri: image.path,
        type: image.mime,
        name: `horse_photo_${index}.jpg`,
      };
      setForm(prev => ({ ...prev, horses: updatedHorses }));
    } catch (e: any) {
      if (e.message !== 'User cancelled image selection') console.log(e);
    }
  };

  const pickDocument = async (
    index: number,
    type: 'coggins' | 'healthCert',
  ) => {
    try {
      const [result] = await pick({
        allowMultiSelection: false,
        type: ['image/*', 'application/pdf'],
      });

      if (!result) return;

      const updatedHorses = [...form.horses];
      updatedHorses[index][type] = {
        uri: result.uri,
        type: result.type || 'application/octet-stream',
        name: result.name || `${type}_${index}`,
      };

      setForm(prev => ({ ...prev, horses: updatedHorses }));
    } catch (error: any) {
      console.log('Doc Picker Error:', error);
    }
  };

  const removeFile = (
    index: number,
    type: 'photo' | 'coggins' | 'healthCert',
  ) => {
    const updatedHorses = [...form.horses];
    updatedHorses[index][type] = null;
    setForm(prev => ({ ...prev, horses: updatedHorses }));
  };

  // 5. Final Submission (FormData Building)
  const handlePublish = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append Flat Fields
      formData.append('pickupLocation', form.pickupLocation);
      formData.append('pickupLat', form.pickupLat.toString());
      formData.append('pickupLng', form.pickupLng.toString());
      formData.append('pickupTimeOption', form.pickupTimeOption);
      formData.append('pickupStartDate', form.pickupStartDate.toISOString());
      formData.append('pickupEndDate', form.pickupEndDate.toISOString());

      formData.append('deliveryLocation', form.deliveryLocation);
      formData.append('deliveryLat', form.deliveryLat.toString());
      formData.append('deliveryLng', form.deliveryLng.toString());
      formData.append('deliveryTimeOption', form.deliveryTimeOption);
      formData.append(
        'deliveryStartDate',
        form.deliveryStartDate.toISOString(),
      );
      formData.append('deliveryEndDate', form.deliveryEndDate.toISOString());

      formData.append('numberOfHorses', form.numberOfHorses.toString());
      formData.append('additionalInfo', form.additionalInfo);
      formData.append('recipientEmail', form.recipientEmail);

      // Append Nested Horse Data
      form.horses.forEach((horse, index) => {
        formData.append(
          `horses[${index}][registeredName]`,
          horse.registeredName,
        );
        formData.append(`horses[${index}][barnName]`, horse.barnName);
        formData.append(`horses[${index}][breed]`, horse.breed);
        formData.append(`horses[${index}][colour]`, horse.colour);
        formData.append(`horses[${index}][age]`, horse.age);
        formData.append(`horses[${index}][sex]`, horse.sex);
        formData.append(
          `horses[${index}][requestedStallSize]`,
          horse.stallType,
        );
        formData.append(`horses[${index}][generalInfo]`, horse.generalInfo);
        formData.append(`horses[${index}][notes]`, horse.notes);

        // Files - The "as any" cast is required for React Native FormData
        if (horse.photo) {
          formData.append(`horse_photo_${index}`, {
            uri: horse.photo.uri,
            name: horse.photo.name,
            type: horse.photo.type,
          } as any);
        }
        if (horse.coggins) {
          formData.append(`horse_coggins_${index}`, {
            uri: horse.coggins.uri,
            name: horse.coggins.name,
            type: horse.coggins.type,
          } as any);
        }
        if (horse.healthCert) {
          formData.append(`horse_health_${index}`, {
            uri: horse.healthCert.uri,
            name: horse.healthCert.name,
            type: horse.healthCert.type,
          } as any);
        }
      });

      await customerService.createShipment(formData);
      navigation.goBack();
      return true;
    } catch (error: any) {
      console.error('Publish Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to publish shipment',
      );
      return false;
    } finally {
      setLoading(false);
      setIsPublishModalVisible(false);
    }
  };

  return {
    form,
    updateForm,
    currentStep,
    nextStep,
    prevStep,
    errors,
    pickImage,
    pickDocument,
    removeFile,
    handlePublish,
    loading,
    isPublishModalVisible,
    setIsPublishModalVisible,
  };
};

export default useNewShipment;
