import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { pick } from '@react-native-documents/picker';
import { StepSchemas } from './validation';
import customerService from '../../../../api/services/customerService';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDayAfterTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(0, 0, 0, 0);
  return d;
};

const createInitialFormState = (): NewShipmentForm => ({
  pickupLocation: '',
  pickupLat: 0,
  pickupLng: 0,
  pickupTimeOption: 'between',
  pickupStartDate: getTomorrow(),
  pickupEndDate: getTomorrow(),
  deliveryLocation: '',
  deliveryLat: 0,
  deliveryLng: 0,
  deliveryTimeOption: 'between',
  deliveryStartDate: getDayAfterTomorrow(),
  deliveryEndDate: getDayAfterTomorrow(),
  numberOfHorses: 1,
  additionalInfo: '',
  recipientEmail: '',
  hasSpecialRequirement: false,
  specialRequirementDetails: '',
  horses: [{ ...defaultHorse }],
});

const parseShipmentDataToForm = (data: any): NewShipmentForm => {
  const horses = (data?.horses || []).map((h: any) => ({
    registeredName: h.registeredName || h.name || '',
    barnName: h.barnName || '',
    breed: h.breed || '',
    colour: h.colour || '',
    age: h.age ? h.age.toString() : '',
    sex: h.sex || '',
    requestedStallSize: h.requestedStallSize || h.stallSize || 'Box',
    generalInfo: h.generalInfo || h.notes || '',
    photo: h.photo?.url
      ? { uri: h.photo.url, type: 'image/jpeg', name: 'photo.jpg' }
      : null,
    coggins: h.coggins?.url
      ? { uri: h.coggins.url, type: 'application/pdf', name: 'coggins.pdf' }
      : null,
    healthCert: h.healthCert?.url
      ? { uri: h.healthCert.url, type: 'application/pdf', name: 'health.pdf' }
      : null,
  }));

  return {
    pickupLocation: data?.pickupLocation || '',
    pickupLat: data?.pickupLat || 0,
    pickupLng: data?.pickupLng || 0,
    pickupTimeOption: data?.pickupTimeOption || 'between',
    pickupStartDate: data?.pickupDateRange?.start
      ? new Date(data?.pickupDateRange.start)
      : getTomorrow(),
    pickupEndDate: data?.pickupDateRange?.end
      ? new Date(data?.pickupDateRange.end)
      : getTomorrow(),
    deliveryLocation: data?.deliveryLocation || '',
    deliveryLat: data?.deliveryLat || 0,
    deliveryLng: data?.deliveryLng || 0,
    deliveryTimeOption: data?.deliveryTimeOption || 'between',
    deliveryStartDate: data?.deliveryDateRange?.start
      ? new Date(data?.deliveryDateRange.start)
      : getDayAfterTomorrow(),
    deliveryEndDate: data?.deliveryDateRange?.end
      ? new Date(data?.deliveryDateRange.end)
      : getDayAfterTomorrow(),
    numberOfHorses: horses.length || data?.numberOfHorses || 1,
    additionalInfo: data?.additionalInfo || data?.notes || '',
    recipientEmail: data?.recipientEmail || '',
    hasSpecialRequirement: !!data?.hasSpecialRequirement,
    specialRequirementDetails: data?.specialRequirementDetails || '',
    horses: horses.length > 0 ? horses : [{ ...defaultHorse }],
  };
};

const useNewShipment = () => {
  const route = useRoute<any>();
  const isEdit = route.params?.isEdit;
  const shipmentData = route.params?.shipmentData;

  const [currentStep, setCurrentStep] = useState(() => (isEdit ? 3 : 0));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);
  const [isDraftModalVisible, setIsDraftModalVisible] = useState(false);
  const [createdShipmentId, setCreatedShipmentId] = useState<string | null>(
    shipmentData?._id || null,
  );
  const navigation = useNavigation();

  const [form, setForm] = useState<NewShipmentForm>(() => {
    if (isEdit && shipmentData) {
      return parseShipmentDataToForm(shipmentData);
    }
    return createInitialFormState();
  });

  useEffect(() => {
    if (isEdit && shipmentData) {
      setForm(parseShipmentDataToForm(shipmentData));
      setCreatedShipmentId(shipmentData?._id);
      setCurrentStep(3);
    }
  }, [isEdit, shipmentData]);

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

  const resetAllData = useCallback(() => {
    setForm(createInitialFormState());
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

    formData?.append('pickupLocation', form.pickupLocation);
    formData?.append('pickupLat', form.pickupLat.toString());
    formData?.append('pickupLng', form.pickupLng.toString());
    formData?.append('pickupTimeOption', form.pickupTimeOption);
    formData?.append(
      'pickupStartDate',
      form.pickupStartDate instanceof Date
        ? form.pickupStartDate.toISOString()
        : new Date(form.pickupStartDate).toISOString(),
    );
    formData?.append(
      'pickupEndDate',
      form.pickupEndDate instanceof Date
        ? form.pickupEndDate.toISOString()
        : new Date(form.pickupEndDate).toISOString(),
    );

    formData?.append('deliveryLocation', form.deliveryLocation);
    formData?.append('deliveryLat', form.deliveryLat.toString());
    formData?.append('deliveryLng', form.deliveryLng.toString());
    formData?.append('deliveryTimeOption', form.deliveryTimeOption);
    formData?.append(
      'deliveryStartDate',
      form.deliveryStartDate instanceof Date
        ? form.deliveryStartDate.toISOString()
        : new Date(form.deliveryStartDate).toISOString(),
    );
    formData?.append(
      'deliveryEndDate',
      form.deliveryEndDate instanceof Date
        ? form.deliveryEndDate.toISOString()
        : new Date(form.deliveryEndDate).toISOString(),
    );

    formData?.append('numberOfHorses', form.numberOfHorses.toString());

    let combinedNotes = form.additionalInfo || '';
    if (form.hasSpecialRequirement && form.specialRequirementDetails) {
      combinedNotes +=
        (combinedNotes ? '\n' : '') +
        `Special Requirements: ${form.specialRequirementDetails}`;
    }
    formData?.append('additionalInfo', combinedNotes);
    formData?.append('recipientEmail', form.recipientEmail || '');

    form.horses.forEach((horse, index) => {
      formData?.append(
        `horses[${index}][registeredName]`,
        horse?.registeredName || '',
      );
      formData?.append(`horses[${index}][barnName]`, horse?.barnName || '');
      formData?.append(`horses[${index}][breed]`, horse?.breed || '');
      formData?.append(`horses[${index}][colour]`, horse?.colour || '');
      formData?.append(
        `horses[${index}][age]`,
        horse?.age ? horse?.age.toString() : '',
      );
      formData?.append(`horses[${index}][sex]`, horse?.sex || '');
      formData?.append(
        `horses[${index}][requestedStallSize]`,
        horse?.requestedStallSize || 'Box',
      );
      formData?.append(
        `horses[${index}][generalInfo]`,
        horse?.generalInfo || '',
      );
      formData?.append(`horses[${index}][notes]`, horse?.generalInfo || '');

      if (horse?.photo) {
        formData?.append(`horses[${index}][photo]`, {
          uri: horse?.photo?.uri,
          name: horse?.photo?.name,
          type: horse?.photo?.type,
        } as any);
      }
      if (horse?.coggins) {
        formData?.append(`horses[${index}][coggins]`, {
          uri: horse?.coggins?.uri,
          name: horse?.coggins?.name,
          type: horse?.coggins?.type,
        } as any);
      }
      if (horse?.healthCert) {
        formData?.append(`horses[${index}][healthCertificate]`, {
          uri: horse?.healthCert?.uri,
          name: horse?.healthCert?.name,
          type: horse?.healthCert?.type,
        } as any);
      }
    });

    return formData;
  };

  const buildUpdateFormData = () => {
    const formData = new FormData();

    if (form.additionalInfo) {
      formData?.append('additionalInfo', form.additionalInfo);
    }

    form.horses.forEach((horse, index) => {
      const notesVal = horse?.generalInfo || '';
      formData?.append(`horses[${index}][generalInfo]`, notesVal);
      formData?.append(`horses[${index}][notes]`, notesVal);

      if (horse?.coggins && horse?.coggins.uri) {
        formData?.append(`horses[${index}][cogins]`, {
          uri: horse?.coggins.uri,
          name: horse?.coggins.name || `coggins_${index + 1}.jpg`,
          type: horse?.coggins.type || 'image/jpeg',
        } as any);
      }

      if (horse?.healthCert && horse?.healthCert.uri) {
        formData?.append(`horses[${index}][healthCertificate]`, {
          uri: horse?.healthCert.uri,
          name: horse?.healthCert.name || `health_${index + 1}.jpg`,
          type: horse?.healthCert.type || 'image/jpeg',
        } as any);
      }

      if (horse?.photo && horse?.photo.uri) {
        formData?.append(`horses[${index}][otherDocuments]`, {
          uri: horse?.photo.uri,
          name: horse?.photo.name || `other_${index + 1}.jpg`,
          type: horse?.photo.type || 'image/jpeg',
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
      const targetId = shipmentData?._id || createdShipmentId;

      if (isEdit && targetId) {
        const formData = buildUpdateFormData();
        await customerService.updateShipmentMetadata(targetId, formData);
        setIsPublishModalVisible(false);
        setIsDraftModalVisible(false);
        Alert.alert('Success', 'Shipment updated successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
        navigation.goBack();
        return true;
      }

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
        resetAllData();
        navigation?.goBack();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Publish Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Failed to update or publish shipment',
      );
      navigation?.goBack();
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
    if (isEdit) {
      if (currentStep > 3) {
        setCurrentStep(prev => prev - 1);
      } else {
        navigation.goBack();
      }
    } else {
      if (currentStep > 0) setCurrentStep(prev => prev - 1);
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
