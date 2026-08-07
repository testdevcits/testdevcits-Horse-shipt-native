import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
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
  stallType: 'Box',
  generalInfo: '',
  photoUrl: null,
  coggins: null,
  healthCert: null,
  otherDocuments: null,
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

const formatDatePayload = (dateVal: any): string => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) { }
  return String(dateVal || '');
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
    stallType: h.stallType || h.stallSize || 'Box',
    generalInfo: h.generalInfo || h.notes || '',
    photo: h.photo?.url
      ? { uri: h.photo.url, type: h.photo.type || 'image/jpeg', name: h.photo.name || 'photo.jpg' }
      : typeof h.photo === 'string'
        ? { uri: h.photo, type: 'image/jpeg', name: 'photo.jpg' }
        : h.photo || null,
    coggins: h.coggins?.url
      ? { uri: h.coggins.url, type: 'application/pdf', name: h.coggins.originalName || h.coggins.name || 'coggins.pdf' }
      : h.documents?.coggins?.url
        ? { uri: h.documents.coggins.url, type: 'application/pdf', name: h.documents.coggins.originalName || h.documents.coggins.name || 'coggins.pdf' }
        : h.coggins || null,
    healthCert: h.healthCert?.url
      ? { uri: h.healthCert.url, type: 'application/pdf', name: h.healthCert.originalName || h.healthCert.name || 'health.pdf' }
      : h.documents?.healthCertificate?.url
        ? { uri: h.documents.healthCertificate.url, type: 'application/pdf', name: h.documents.healthCertificate.originalName || h.documents.healthCertificate.name || 'health.pdf' }
        : h.healthCert || null,
    otherDocuments: h.otherDocuments?.url || h.other?.url || h.documents?.other?.url || h.documents?.otherDocuments?.url
      ? {
        uri:
          h.otherDocuments?.url ||
          h.other?.url ||
          h.documents?.other?.url ||
          h.documents?.otherDocuments?.url,
        type: 'application/pdf',
        name: 'other_document.pdf',
      }
      : h.otherDocuments || null,
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

  const isDraft =
    shipmentData?.publish === false ||
    (shipmentData?.status || '').toLowerCase() === 'draft';

  const [currentStep, setCurrentStep] = useState(() => {
    if (isEdit && isDraft) return 0;
    if (isEdit) return 2;
    return 0;
  });
  const [draftLoading, setDraftLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const loading = draftLoading || publishLoading;
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
      const isDraftShipment =
        shipmentData?.publish === false ||
        (shipmentData?.status || '').toLowerCase() === 'draft';
      if (isDraftShipment) {
        setCurrentStep(0);
      }
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
        compressImageQuality: 0.8,
      });

      if (image?.size && image.size > 1 * 1024 * 1024) {
        Toast.show({
          type: 'error',
          text1: 'File Too Large',
          text2: 'Selected horse photo must be 1 MB or less.',
        });
        return;
      }

      if (image?.path) {
        setForm(prev => {
          const newHorses = [...prev.horses];
          newHorses[index] = {
            ...newHorses[index],
            photoUrl: {
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
    type: 'coggins' | 'healthCert' | 'otherDocuments',
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
    type: 'photo' | 'coggins' | 'healthCert' | 'otherDocuments',
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
    formData?.append('pickupStartDate', formatDatePayload(form.pickupStartDate));
    formData?.append('pickupEndDate', formatDatePayload(form.pickupEndDate));

    formData?.append('deliveryLocation', form.deliveryLocation);
    formData?.append('deliveryLat', form.deliveryLat.toString());
    formData?.append('deliveryLng', form.deliveryLng.toString());
    formData?.append('deliveryTimeOption', form.deliveryTimeOption);
    formData?.append('deliveryStartDate', formatDatePayload(form.deliveryStartDate));
    formData?.append('deliveryEndDate', formatDatePayload(form.deliveryEndDate));

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
      formData?.append(
        `horses[${index}][otherBreed]`,
        (horse as any)?.otherBreed || '',
      );
      formData?.append(`horses[${index}][colour]`, horse?.colour || '');
      formData?.append(
        `horses[${index}][age]`,
        horse?.age ? horse?.age.toString() : '',
      );
      formData?.append(`horses[${index}][sex]`, horse?.sex || '');
      formData?.append(
        `horses[${index}][stallType]`,
        horse?.requestedStallSize || horse?.stallType || 'Box',
      );
      formData?.append(`horses[${index}][size]`, (horse as any)?.size || '');
      formData?.append(
        `horses[${index}][generalInfo]`,
        horse?.generalInfo || '',
      );
      formData?.append(
        `horses[${index}][notes]`,
        horse?.generalInfo || (horse as any)?.notes || '',
      );

      // Photo handling
      const photoPayload = horse?.photo || horse?.photoUrl;
      if (photoPayload) {
        if (typeof photoPayload === 'string') {
          formData?.append(`horses[${index}][photoUrl]`, photoPayload);
        } else if (
          photoPayload.uri?.startsWith('http://') ||
          photoPayload.uri?.startsWith('https://')
        ) {
          formData?.append(`horses[${index}][photoUrl]`, photoPayload.uri);
        } else if (photoPayload.uri) {
          formData?.append(`horses[${index}][photoUrl]`, {
            uri: photoPayload.uri,
            name: photoPayload.name || `photo_${index + 1}.jpg`,
            type: photoPayload.type || 'image/jpeg',
          } as any);
        }
      }

      // Coggins handling (key: cogins)
      if (horse?.coggins) {
        if (typeof horse.coggins === 'string') {
          formData?.append(`horses[${index}][cogins]`, horse.coggins);
        } else if (
          horse.coggins.uri?.startsWith('http://') ||
          horse.coggins.uri?.startsWith('https://')
        ) {
          formData?.append(`horses[${index}][cogins]`, horse.coggins.uri);
        } else if (horse.coggins.uri) {
          formData?.append(`horses[${index}][cogins]`, {
            uri: horse.coggins.uri,
            name: horse.coggins.name || `coggins_${index + 1}.pdf`,
            type: horse.coggins.type || 'application/pdf',
          } as any);
        }
      }

      // Health Certificate handling (key: healthCertificate)
      if (horse?.healthCert) {
        if (typeof horse.healthCert === 'string') {
          formData?.append(
            `horses[${index}][healthCertificate]`,
            horse.healthCert,
          );
        } else if (
          horse.healthCert.uri?.startsWith('http://') ||
          horse.healthCert.uri?.startsWith('https://')
        ) {
          formData?.append(
            `horses[${index}][healthCertificate]`,
            horse.healthCert.uri,
          );
        } else if (horse.healthCert.uri) {
          formData?.append(`horses[${index}][healthCertificate]`, {
            uri: horse.healthCert.uri,
            name: horse.healthCert.name || `health_${index + 1}.pdf`,
            type: horse.healthCert.type || 'application/pdf',
          } as any);
        }
      }

      // Other Documents handling (key: otherDocuments)
      if (horse?.otherDocuments) {
        if (typeof horse.otherDocuments === 'string') {
          formData?.append(
            `horses[${index}][otherDocuments]`,
            horse.otherDocuments,
          );
        } else if (
          horse.otherDocuments.uri?.startsWith('http://') ||
          horse.otherDocuments.uri?.startsWith('https://')
        ) {
          formData?.append(
            `horses[${index}][otherDocuments]`,
            horse.otherDocuments.uri,
          );
        } else if (horse.otherDocuments.uri) {
          formData?.append(`horses[${index}][otherDocuments]`, {
            uri: horse.otherDocuments.uri,
            name: horse.otherDocuments.name || `other_${index + 1}.pdf`,
            type: horse.otherDocuments.type || 'application/pdf',
          } as any);
        }
      }
    });

    return formData;
  };

  const buildUpdateFormData = () => {
    const formData = new FormData();

    let combinedNotes = form.additionalInfo || '';
    if (form.hasSpecialRequirement && form.specialRequirementDetails) {
      combinedNotes +=
        (combinedNotes ? '\n' : '') +
        `Special Requirements: ${form.specialRequirementDetails}`;
    }
    formData?.append('additionalInfo', combinedNotes);

    form.horses.forEach((horse, index) => {
      formData?.append(
        `horses[${index}][generalInfo]`,
        horse?.generalInfo || '',
      );
      formData?.append(
        `horses[${index}][notes]`,
        (horse as any)?.notes || horse?.generalInfo || '',
      );

      if (
        horse?.coggins &&
        horse?.coggins.uri &&
        !horse.coggins.uri.startsWith('http://') &&
        !horse.coggins.uri.startsWith('https://')
      ) {
        formData?.append(`horses[${index}][cogins]`, {
          uri: horse?.coggins.uri,
          name: horse?.coggins.name || `coggins_${index + 1}.pdf`,
          type: horse?.coggins.type || 'application/pdf',
        } as any);
      }

      if (
        horse?.healthCert &&
        horse?.healthCert.uri &&
        !horse.healthCert.uri.startsWith('http://') &&
        !horse.healthCert.uri.startsWith('https://')
      ) {
        formData?.append(`horses[${index}][healthCertificate]`, {
          uri: horse?.healthCert.uri,
          name: horse?.healthCert.name || `health_${index + 1}.pdf`,
          type: horse?.healthCert.type || 'application/pdf',
        } as any);
      }

      if (
        horse?.otherDocuments &&
        horse?.otherDocuments.uri &&
        !horse.otherDocuments.uri.startsWith('http://') &&
        !horse.otherDocuments.uri.startsWith('https://')
      ) {
        formData?.append(`horses[${index}][otherDocuments]`, {
          uri: horse?.otherDocuments.uri,
          name: horse?.otherDocuments.name || `other_${index + 1}.pdf`,
          type: horse?.otherDocuments.type || 'application/pdf',
        } as any);
      }
    });

    return formData;
  };

  const handleSaveDraft = async () => {
    setDraftLoading(true);
    try {
      const targetId = shipmentData?._id || createdShipmentId;

      if (targetId) {
        const formData = buildFormData();
        await customerService.updateShipment(targetId, formData);
        setIsDraftModalVisible(true);
        return true;
      } else {
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
      }
    } catch (error: any) {
      console.error('Draft Error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to save draft shipment',
      );
      return false;
    } finally {
      setDraftLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishLoading(true);
    try {
      const targetId = shipmentData?._id || createdShipmentId;

      if (isEdit && targetId) {
        const formData = buildFormData();
        await customerService.updateShipment(targetId, formData);

        if (isDraft) {
          await customerService.publishShipment(targetId);
        }

        setIsPublishModalVisible(false);
        setIsDraftModalVisible(false);
        Toast.show({
          type: 'success',
          text1: isDraft ? 'Shipment Published' : 'Shipment Updated',
          text2: isDraft
            ? 'Draft shipment updated and published successfully!'
            : 'Shipment updated successfully!',
        });
        resetAllData();
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
        } else {
          Alert.alert(
            'Error',
            response?.message || 'Failed to create shipment.',
          );
          setPublishLoading(false);
          setIsPublishModalVisible(false);
          return false;
        }
      }

      if (shipmentId) {
        await customerService.publishShipment(shipmentId);
        setIsPublishModalVisible(false);
        setIsDraftModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Shipment Published',
          text2: 'Shipment published successfully!',
        });
        resetAllData();
        navigation.goBack();
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
      return false;
    } finally {
      setPublishLoading(false);
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
    if (isEdit && !isDraft && currentStep === 2) {
      navigation.goBack();
      return;
    }
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
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
    draftLoading,
    publishLoading,
    isPublishModalVisible,
    setIsPublishModalVisible,
    isDraftModalVisible,
    setIsDraftModalVisible,
    setCurrentStep,
    resetAllData,
    isDraft,
  };
};

export default useNewShipment;
