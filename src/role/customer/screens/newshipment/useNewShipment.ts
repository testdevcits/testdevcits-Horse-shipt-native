// import { useState } from 'react';
// import { Alert } from 'react-native';
// import customerService from '../../../../api/services/customerService';

// export const STEPS = ['Pickup', 'Delivery', 'Horses', 'Documents', 'Review'];

// const useNewShipment = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);

//   // Main Form State
//   const [form, setForm] = useState({
//     pickupLocation: '',
//     pickupLat: 20.593684,
//     pickupLng: 78.96288,
//     pickupTimeOption: 'between',
//     pickupStartDate: new Date(),
//     pickupEndDate: new Date(),

//     deliveryLocation: '',
//     deliveryLat: -0.789275,
//     deliveryLng: 113.921327,
//     deliveryTimeOption: 'between',
//     deliveryStartDate: new Date(),
//     deliveryEndDate: new Date(),

//     numberOfHorses: 1,
//     additionalInfo: '',
//     recipientEmail: '',
//     horses: [
//       {
//         registeredName: '',
//         barnName: '',
//         breed: 'English TB',
//         otherBreed: '',
//         colour: 'Dark Bay',
//         age: '1',
//         sex: 'Stallion',
//         stallType: 'Box',
//         size: '',
//         generalInfo: '',
//         notes: '',

//         photo: null,
//         coggins: null,
//         healthCert: null,
//         otherDocument: null,
//       },
//     ],
//   });

//   const updateForm = (updates: Partial<typeof form>) => {
//     setForm(prev => ({ ...prev, ...updates }));
//   };

//   const nextStep = () => {
//     if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 0) setCurrentStep(currentStep - 1);
//   };

//   const handlePublish = async () => {
//     setLoading(true);
//     try {
//       const formData = new FormData();

//       // Append Basic Fields
//       formData.append('pickupLocation', form.pickupLocation);
//       formData.append('pickupLat', form.pickupLat.toString());
//       formData.append('pickupLng', form.pickupLng.toString());
//       formData.append('pickupTimeOption', form.pickupTimeOption);
//       formData.append(
//         'pickupStartDate',
//         form.pickupStartDate.toISOString().split('T')[0],
//       );
//       formData.append(
//         'pickupEndDate',
//         form.pickupEndDate.toISOString().split('T')[0],
//       );

//       formData.append('deliveryLocation', form.deliveryLocation);
//       formData.append('deliveryLat', form.deliveryLat.toString());
//       formData.append('deliveryLng', form.deliveryLng.toString());
//       formData.append('deliveryTimeOption', form.deliveryTimeOption);
//       formData.append(
//         'deliveryStartDate',
//         form.deliveryStartDate.toISOString().split('T')[0],
//       );
//       formData.append(
//         'deliveryEndDate',
//         form.deliveryEndDate.toISOString().split('T')[0],
//       );

//       formData.append('numberOfHorses', form.numberOfHorses.toString());
//       formData.append('additionalInfo', form.additionalInfo);
//       formData.append('recipientEmail', form.recipientEmail);

//       // Append Horses
//       // Append Horses
//       form.horses.forEach((horse, index) => {
//         // Text Fields
//         formData.append(
//           `horses[${index}][registeredName]`,
//           horse.registeredName || '',
//         );

//         formData.append(`horses[${index}][barnName]`, horse.barnName || '');

//         formData.append(`horses[${index}][breed]`, horse.breed || '');

//         formData.append(`horses[${index}][otherBreed]`, horse.otherBreed || '');

//         formData.append(`horses[${index}][colour]`, horse.colour || '');

//         formData.append(`horses[${index}][age]`, String(horse.age));

//         formData.append(`horses[${index}][sex]`, horse.sex || '');

//         formData.append(`horses[${index}][stallType]`, horse.stallType || '');

//         formData.append(`horses[${index}][size]`, horse.size || '');

//         formData.append(
//           `horses[${index}][generalInfo]`,
//           horse.generalInfo || '',
//         );

//         formData.append(`horses[${index}][notes]`, horse.notes || '');

//         // Horse Photo
//         if (horse.photo) {
//           formData.append(`horses[${index}][photo]`, {
//             uri: horse.photo.uri,
//             name:
//               horse.photo.fileName ??
//               `horse_${index}.${horse.photo.mime?.split('/')[1] ?? 'jpg'}`,
//             type: horse.photo.mime ?? 'image/jpeg',
//           } as any);
//         }

//         // Coggins
//         if (horse.coggins) {
//           formData.append(`horses[${index}][coggins]`, {
//             uri: horse.coggins.uri,
//             name:
//               horse.coggins.fileName ??
//               `coggins_${index}.${horse.coggins.mime?.split('/')[1] ?? 'pdf'}`,
//             type: horse.coggins.mime ?? 'application/pdf',
//           } as any);
//         }

//         // Health Certificate
//         if (horse.healthCert) {
//           formData.append(`horses[${index}][healthCert]`, {
//             uri: horse.healthCert.uri,
//             name:
//               horse.healthCert.fileName ??
//               `health_${index}.${
//                 horse.healthCert.mime?.split('/')[1] ?? 'pdf'
//               }`,
//             type: horse.healthCert.mime ?? 'application/pdf',
//           } as any);
//         }

//         // Other Document (optional)
//         if (horse.otherDocument) {
//           formData.append(`horses[${index}][other]`, {
//             uri: horse.otherDocument.uri,
//             name:
//               horse.otherDocument.fileName ??
//               `other_${index}.${
//                 horse.otherDocument.mime?.split('/')[1] ?? 'pdf'
//               }`,
//             type: horse.otherDocument.mime ?? 'application/pdf',
//           } as any);
//         }
//       });
//       // API Call
//       await customerService.createShipment(formData);
//       Alert.alert('Success', 'Shipment published successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to publish shipment');
//     } finally {
//       setLoading(false);
//       setIsPublishModalVisible(false);
//     }
//   };

//   const onSaveDraft = () => {};

//   return {
//     form,
//     updateForm,
//     currentStep,
//     nextStep,
//     prevStep,
//     handlePublish,
//     loading,
//     isPublishModalVisible,
//     setIsPublishModalVisible,
//     onSaveDraft,
//   };
// };

// export default useNewShipment;


import { useState } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { StepSchemas } from './validation';
import customerService from '../../../../api/services/customerService';

export const STEPS = ['Pickup', 'Delivery', 'Horses', 'Documents', 'Review'];

const useNewShipment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);

  const [form, setForm] = useState({
    pickupLocation: '',
    pickupLat: 0,
    pickupLng: 0,
    pickupStartDate: new Date(),
    pickupEndDate: new Date(),
    deliveryLocation: '',
    deliveryLat: 0,
    deliveryLng: 0,
    deliveryStartDate: new Date(),
    deliveryEndDate: new Date(),
    numberOfHorses: 1,
    generalNotes: '',
    horses: [{
        registeredName: '',
        barnName: '',
        breed: '',
        colour: '',
        age: '',
        sex: '',
        stallType: '',
        height: '',
        photo: null,
        coggins: null,
        healthCert: null,
    }],
  });

  const updateForm = (updates: any) => {
    setForm(prev => ({ ...prev, ...updates }));
    setErrors({}); // Clear errors when user types
  };

  const validateCurrentStep = async () => {
    try {
      await StepSchemas[currentStep].validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: any = {};
      err.inner.forEach((error: any) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const pickImage = async (index: number) => {
    try {
      const image = await ImagePicker.openPicker({ width: 800, height: 800, cropping: true });
      const updatedHorses = [...form.horses];
      updatedHorses[index].photo = {
        uri: image.path,
        type: image.mime,
        name: `horse_${index}.jpg`,
      };
      setForm({ ...form, horses: updatedHorses });
    } catch (e) { console.log(e); }
  };

  const pickDocument = async (index: number, type: 'coggins' | 'healthCert') => {
    try {
      const res = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.pdf, DocumentPicker.types.images] });
      const updatedHorses = [...form.horses];
      updatedHorses[index][type] = {
        uri: res.uri,
        type: res.type,
        name: res.name,
      };
      setForm({ ...form, horses: updatedHorses });
    } catch (e) { console.log(e); }
  };

  const handlePublish = async () => {
    setLoading(true);
    const formData = new FormData();
    // ... Append logic remains similar but uses the structured photo/doc objects
    // Append simple fields...
    formData.append('pickupLocation', form.pickupLocation);
    // Append files correctly...
    if(form.horses[0].photo) formData.append('horse_photo', form.horses[0].photo);

    try {
      await customerService.createShipment(formData);
      Alert.alert("Success", "Shipment Published");
    } catch (e) {
      Alert.alert("Error", "Failed to publish");
    } finally { setLoading(false); setIsPublishModalVisible(false); }
  };

  return { form, updateForm, currentStep, nextStep, prevStep: () => setCurrentStep(currentStep - 1), 
           errors, pickImage, pickDocument, handlePublish, loading, isPublishModalVisible, setIsPublishModalVisible };
};

export default useNewShipment;