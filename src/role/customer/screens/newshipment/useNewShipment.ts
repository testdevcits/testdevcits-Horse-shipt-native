import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { pick } from '@react-native-documents/picker';
import { StepSchemas } from './validation';
import customerService from '../../../../api/services/customerService';
import { useNavigation } from '@react-navigation/native';
import { NewShipmentForm, NewShipmentHorse } from './interfaces';

export const STEPS = ['Pickup', 'Delivery', 'Horses', 'Documents', 'Review'];

const defaultHorse: NewShipmentHorse = {
  registeredName: '',
  barnName: '',
  breed: '',
  colour: '',
  age: '',
  sex: '',
  requestedStallSize: 'Box',
  generalInfo: '',
  photo: null,
  coggins: null,
  healthCert: null,
};

const useNewShipment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);
  const [isDraftModalVisible, setIsDraftModalVisible] = useState(false);
  const [createdShipmentId, setCreatedShipmentId] = useState<string | null>(
    null,
  );
  const navigation = useNavigation();

  const [form, setForm] = useState<NewShipmentForm>({
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
    hasSpecialRequirement: false,
    specialRequirementDetails: '',

    horses: [{ ...defaultHorse }],
  });

  const updateForm = useCallback((updates: Partial<NewShipmentForm>) => {
    setForm(prev => {
      const newState = { ...prev, ...updates };
      if (updates.numberOfHorses !== undefined) {
        const targetCount = Math.max(
          1,
          parseInt(String(updates.numberOfHorses)) || 1,
        );
        let updatedHorses = [...newState.horses];

        if (targetCount > updatedHorses.length) {
          const diff = targetCount - updatedHorses.length;
          for (let i = 0; i < diff; i++) {
            updatedHorses.push({ ...defaultHorse });
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

  const INITIAL_FORM_STATE: NewShipmentForm = {
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
  hasSpecialRequirement: false,
  specialRequirementDetails: '',
  horses: [{ 
    registeredName: '',
    barnName: '',
    breed: '',
    colour: '',
    age: '',
    sex: '',
    requestedStallSize: 'Box',
    generalInfo: '',
    photo: null,
    coggins: null,
    healthCert: null,
  }],
};

  const resetAllData = useCallback(() => {
  setForm(INITIAL_FORM_STATE);
  setCurrentStep(0);
  setCreatedShipmentId(null);
  setErrors({});
  setIsPublishModalVisible(false);
  setIsDraftModalVisible(false);
}, []);

  const pickImage = async (index: number) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
      });
      if (image?.path) {
        setForm(prev => {
          const newHorses = [...prev.horses];
          newHorses[index] = {
            ...newHorses[index],
            photo: {
              uri: image.path,
              type: image.mime || 'image/jpeg',
              name: image.filename || `horse_photo_${index + 1}.jpg`,
            },
          };
          return { ...prev, horses: newHorses };
        });
      }
    } catch (e: any) {
      if (
        e?.message !== 'User cancelled image selection' &&
        e !== 'E_PICKER_CANCELLED'
      ) {
        console.log('Image picker error:', e);
      }
    }
  };

  const pickDocument = async (
    index: number,
    type: 'coggins' | 'healthCert',
  ) => {
    try {
      const [result] = await pick({ type: ['image/*', 'application/pdf'] });
      if (!result) return;
      setForm(prev => {
        const newHorses = [...prev.horses];
        newHorses[index] = {
          ...newHorses[index],
          [type]: {
            uri: result.uri,
            type: result.type || 'application/octet-stream',
            name: result.name || `${type}_${index + 1}`,
          },
        };
        return { ...prev, horses: newHorses };
      });
    } catch (error: any) {
      console.log('Document picker error:', error);
    }
  };

  const removeFile = (
    index: number,
    type: 'photo' | 'coggins' | 'healthCert',
  ) => {
    setForm(prev => {
      const newHorses = [...prev.horses];
      newHorses[index] = { ...newHorses[index], [type]: null };
      return { ...prev, horses: newHorses };
    });
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append('pickupLocation', form.pickupLocation);
    formData.append('pickupLat', form.pickupLat.toString());
    formData.append('pickupLng', form.pickupLng.toString());
    formData.append('pickupTimeOption', form.pickupTimeOption);
    formData.append(
      'pickupStartDate',
      form.pickupStartDate instanceof Date
        ? form.pickupStartDate.toISOString()
        : new Date(form.pickupStartDate).toISOString(),
    );
    formData.append(
      'pickupEndDate',
      form.pickupEndDate instanceof Date
        ? form.pickupEndDate.toISOString()
        : new Date(form.pickupEndDate).toISOString(),
    );

    formData.append('deliveryLocation', form.deliveryLocation);
    formData.append('deliveryLat', form.deliveryLat.toString());
    formData.append('deliveryLng', form.deliveryLng.toString());
    formData.append('deliveryTimeOption', form.deliveryTimeOption);
    formData.append(
      'deliveryStartDate',
      form.deliveryStartDate instanceof Date
        ? form.deliveryStartDate.toISOString()
        : new Date(form.deliveryStartDate).toISOString(),
    );
    formData.append(
      'deliveryEndDate',
      form.deliveryEndDate instanceof Date
        ? form.deliveryEndDate.toISOString()
        : new Date(form.deliveryEndDate).toISOString(),
    );

    formData.append('numberOfHorses', form.numberOfHorses.toString());

    let combinedNotes = form.additionalInfo || '';
    if (form.hasSpecialRequirement && form.specialRequirementDetails) {
      combinedNotes +=
        (combinedNotes ? '\n' : '') +
        `Special Requirements: ${form.specialRequirementDetails}`;
    }
    formData.append('additionalInfo', combinedNotes);
    formData.append('recipientEmail', form.recipientEmail || '');

    form.horses.forEach((horse, index) => {
      formData.append(
        `horses[${index}][registeredName]`,
        horse.registeredName || '',
      );
      formData.append(`horses[${index}][barnName]`, horse.barnName || '');
      formData.append(`horses[${index}][breed]`, horse.breed || '');
      formData.append(`horses[${index}][colour]`, horse.colour || '');
      formData.append(
        `horses[${index}][age]`,
        horse.age ? horse.age.toString() : '',
      );
      formData.append(`horses[${index}][sex]`, horse.sex || '');
      formData.append(
        `horses[${index}][requestedStallSize]`,
        horse.requestedStallSize || 'Box',
      );
      formData.append(`horses[${index}][generalInfo]`, horse.generalInfo || '');
      formData.append(`horses[${index}][notes]`, horse.generalInfo || '');

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

    return formData;
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const formData = buildFormData();
      const response: any = await customerService.createShipment(formData);
      const success = response?.success || response?.data?.success;
      const shipment = response?.shipment || response?.data?.shipment;
      if (success && shipment?._id) {
        setCreatedShipmentId(shipment._id);
        setIsDraftModalVisible(true);
        return true;
      } else {
        Alert.alert(
          'Error',
          response?.message || 'Failed to save draft shipment.',
        );
        return false;
      }
    } catch (error: any) {
      console.error('Draft Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to save draft shipment',
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      let shipmentId = createdShipmentId;

      if (!shipmentId) {
        const formData = buildFormData();
        const response: any = await customerService.createShipment(formData);
        const success = response?.success || response?.data?.success;
        const shipment = response?.shipment || response?.data?.shipment;
        if (success && shipment?._id) {
          shipmentId = shipment._id;
          setCreatedShipmentId(shipment._id);
          navigation.goBack();
        } else {
          Alert.alert(
            'Error',
            response?.message || 'Failed to create shipment.',
          );
          setLoading(false);
          setIsPublishModalVisible(false);
          navigation.goBack();
          return false;
        }
      }

      if (shipmentId) {
        await customerService.publishShipment(shipmentId);
        setIsPublishModalVisible(false);
        setIsDraftModalVisible(false);
        Alert.alert('Success', 'Shipment published successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
         resetAllData(); // <--- THIS RESETS EVERYTHING
        navigation.goBack()
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Publish Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to publish shipment',
      );
      navigation.goBack()
      return false;
    } finally {
      setLoading(false);
      setIsPublishModalVisible(false);
    }
  };

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
    handleSaveDraft,
    handlePublish,
    loading,
    isPublishModalVisible,
    setIsPublishModalVisible,
    isDraftModalVisible,
    setIsDraftModalVisible,
    setCurrentStep,
  };
};

export default useNewShipment;
