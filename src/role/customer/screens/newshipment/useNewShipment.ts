import { useState } from 'react';
import { Alert } from 'react-native';
import customerService from '../../../../api/services/customerService';
 
export const STEPS = [
  'Pickup',
  'Delivery',
  'Horses',
  'Documents',
  'Review'
];

const useNewShipment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);

  // Main Form State
  const [form, setForm] = useState({
    pickupLocation: '',
    pickupLat: 20.593684,
    pickupLng: 78.96288,
    pickupTimeOption: 'between',
    pickupStartDate: new Date(),
    pickupEndDate: new Date(),

    deliveryLocation: '',
    deliveryLat: -0.789275,
    deliveryLng: 113.921327,
    deliveryTimeOption: 'between',
    deliveryStartDate: new Date(),
    deliveryEndDate: new Date(),

    numberOfHorses: 1,
    additionalInfo: '',
    recipientEmail: '',
    horses: [
      {
        registeredName: '',
        barnName: '',
        breed: 'English TB',
        otherBreed: '',
        colour: 'Dark Bay',
        age: '1',
        sex: 'Stallion',
        stallType: 'Box',
        size: '',
        generalInfo: '',
        notes: '',
        photo: null as any,
        coggins: null as any,
        healthCert: null as any,
      }
    ]
  });

  const updateForm = (updates: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append Basic Fields
      formData.append('pickupLocation', form.pickupLocation);
      formData.append('pickupLat', form.pickupLat.toString());
      formData.append('pickupLng', form.pickupLng.toString());
      formData.append('pickupTimeOption', form.pickupTimeOption);
      formData.append('pickupStartDate', form.pickupStartDate.toISOString().split('T')[0]);
      formData.append('pickupEndDate', form.pickupEndDate.toISOString().split('T')[0]);

      formData.append('deliveryLocation', form.deliveryLocation);
      formData.append('deliveryLat', form.deliveryLat.toString());
      formData.append('deliveryLng', form.deliveryLng.toString());
      formData.append('deliveryTimeOption', form.deliveryTimeOption);
      formData.append('deliveryStartDate', form.deliveryStartDate.toISOString().split('T')[0]);
      formData.append('deliveryEndDate', form.deliveryEndDate.toISOString().split('T')[0]);

      formData.append('numberOfHorses', form.numberOfHorses.toString());
      formData.append('additionalInfo', form.additionalInfo);
      formData.append('recipientEmail', form.recipientEmail);

      // Append Horses
      form.horses.forEach((horse, index) => {
        formData.append(`horses[${index}][registeredName]`, horse.registeredName);
        formData.append(`horses[${index}][barnName]`, horse.barnName);
        formData.append(`horses[${index}][breed]`, horse.breed);
        formData.append(`horses[${index}][colour]`, horse.colour);
        formData.append(`horses[${index}][age]`, horse.age);
        formData.append(`horses[${index}][sex]`, horse.sex);
        formData.append(`horses[${index}][stallType]`, horse.stallType);
        formData.append(`horses[${index}][notes]`, horse.notes);

        if (horse.photo) {
          formData.append(`horses[${index}][photo]`, {
            uri: horse.photo.uri,
            name: `horse_${index}.jpg`,
            type: 'image/jpeg',
          } as any);
        }
      });

      // API Call
      await customerService.createShipment(formData);
      Alert.alert("Success", "Shipment published successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to publish shipment");
    } finally {
      setLoading(false);
      setIsPublishModalVisible(false);
    }
  };

  const onSaveDraft=()=>{

  }

  return {
    form,
    updateForm,
    currentStep,
    nextStep,
    prevStep,
    handlePublish,
    loading,
    isPublishModalVisible,
    setIsPublishModalVisible,
    onSaveDraft
  };
};

export default useNewShipment;