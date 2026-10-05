import { useState, useEffect } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { pick, types } from '@react-native-documents/picker';
import customerService from '../../../../api/services/customerService';
import { defaultColors } from './constants';
import { Horse } from '../../../../types/customer';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { useDispatch } from 'react-redux';
import { setHorses } from '../../../../redux/slices/horseSlice';

const getValidDoc = (doc: any) => {
  if (!doc) return null;
  if (typeof doc === 'string' && doc.trim().length > 0) return doc;
  if (
    typeof doc === 'object' &&
    (doc.url || doc.uri || doc.name || doc.originalName)
  ) {
    return doc;
  }
  return null;
};

const useAddEditHorse = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [_loading, _setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  const [colorOptions, setColorOptions] = useState<string[]>(defaultColors);

  const horse = (route.params as any)?.horse as Horse | undefined;
  const isEdit = !!horse;

  // Fetch dynamic colors from /api/admin/colors/all
  useEffect(() => {
    let isMounted = true;
    const fetchColors = async () => {
      try {
        const response = await customerService.getColors();
        if (response?.success && Array.isArray(response?.data)) {
          const activeColors = response.data
            .filter((c: any) => c.isActive !== false && c.name)
            .map((c: any) => c.name);
          if (activeColors.length > 0 && isMounted) {
            const merged = Array.from(
              new Set([...activeColors, ...defaultColors]),
            );
            setColorOptions(merged);
          }
        }
      } catch (err) {
        console.log('Error fetching colors:', err);
      }
    };
    fetchColors();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialValues = {
    registeredName: horse?.registeredName || '',
    barnName: horse?.barnName || '',
    colour: horse?.colour || '',
    age: horse?.age ? String(horse.age) : '',
    breed: horse?.breed || '',
    otherBreed: horse?.otherBreed || '',
    sex: horse?.sex || '',
    defaultStallSize:
      horse?.defaultStallSize || (horse as any)?.stallType || '',
    notes: horse?.notes || '',
    photo: horse?.photo || null,
    coggins: getValidDoc(
      horse?.documents?.coggins || (horse as any)?.coggins,
    ),
    healthCertificate: getValidDoc(
      horse?.documents?.healthCertificate ||
        (horse as any)?.healthCert ||
        (horse as any)?.healthCertificate,
    ),
  };

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const handlePickPhoto = async (
    setFieldValue: (field: string, val: any) => void,
  ) => {
    if (isPicking) return;

    setIsPicking(true);

    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      if (image?.size && image.size > MAX_FILE_SIZE_BYTES) {
        showErrorToast(
          'File Too Large',
          'Selected image must be 5 MB or less.',
        );
        return;
      }

      if (image?.path) {
        setFieldValue('photo', {
          uri: image.path,
          type: image.mime || 'image/jpeg',
          name: image.filename || 'photo.jpg',
        });
      }
    } catch (e: any) {
      if (
        e?.message !== 'User cancelled image selection' &&
        e !== 'E_PICKER_CANCELLED'
      ) {
        console.log('Image picker error:', e);
      }
    } finally {
      setIsPicking(false);
    }
  };

  const handlePickDocument = async (
    field: 'coggins' | 'healthCertificate',
    setFieldValue: (field: string, val: any) => void,
  ) => {
    if (isPicking) return;

    setIsPicking(true);

    try {
      const [result] = await pick({ type: [types.pdf] });
      if (!result) return;

      if (result.size && result.size > MAX_FILE_SIZE_BYTES) {
        showErrorToast(
          'File Too Large',
          'Selected document must be 5 MB or less.',
        );
        return;
      }

      const rawName = result.name || `${field}.pdf`;
      const pdfName = rawName.toLowerCase().endsWith('.pdf')
        ? rawName
        : `${rawName}.pdf`;
      setFieldValue(field, {
        uri: result.uri,
        type: 'application/pdf',
        name: pdfName,
      });
    } catch (error: any) {
      const isCancelled =
        error?.code === 'DOCUMENT_PICKER_CANCELED' ||
        (error?.message &&
          typeof error.message === 'string' &&
          error.message.toLowerCase().includes('cancel'));
      if (!isCancelled) {
        console.log('Document picker error:', error);
      }
    } finally {
      setIsPicking(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData?.append('registeredName', values?.registeredName);
      formData?.append('barnName', values?.barnName);
      formData?.append('colour', values?.colour);
      formData?.append('age', values?.age);
      formData?.append('breed', values?.breed);
      formData?.append(
        'otherBreed',
        values?.breed === 'Other' || values?.breed === 'Other Breed'
          ? values?.otherBreed
          : values?.otherBreed || '',
      );
      formData?.append('sex', values?.sex);
      formData?.append('stallType', values?.defaultStallSize);
      formData?.append('defaultStallSize', values?.defaultStallSize);
      formData?.append('notes', values?.notes || '');

      if (values?.photo && values?.photo.uri) {
        formData?.append('photo', {
          uri: values?.photo.uri,
          type: values?.photo.type || 'image/jpeg',
          name: values?.photo.name || 'photo.jpg',
        } as any);
      }

      if (values?.coggins && values?.coggins.uri) {
        const rawName = values?.coggins.name || 'coggins.pdf';
        const pdfName = rawName.toLowerCase().endsWith('.pdf')
          ? rawName
          : `${rawName}.pdf`;
        formData?.append('coggins', {
          uri: values?.coggins.uri,
          type: 'application/pdf',
          name: pdfName,
        } as any);
      }

      if (values?.healthCertificate && values?.healthCertificate.uri) {
        const rawName =
          values?.healthCertificate.name || 'healthCertificate.pdf';
        const pdfName = rawName.toLowerCase().endsWith('.pdf')
          ? rawName
          : `${rawName}.pdf`;
        formData?.append('healthCertificate', {
          uri: values?.healthCertificate.uri,
          type: 'application/pdf',
          name: pdfName,
        } as any);
      }

      if (isEdit && horse?._id) {
        await customerService.updateHorse(horse._id, formData);

        showSuccessToast('Success', 'Horse updated successfully');
      } else {
        await customerService.addHorse(formData);

        showSuccessToast('Success', 'Horse added successfully');
      }
      const response = await customerService.getHorses();
      if (response?.success && response?.horses) {
        dispatch(setHorses(response.horses));
      }
      navigation.goBack();
    } catch (error: any) {
      console.log('Error submitting horse:', error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      showErrorToast('Error', errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    isPicking,
    colorOptions,
    initialValues,
    handlePickPhoto,
    handlePickDocument,
    handleSubmit,
    navigation,
    route,
    isEdit,
    _loading,
  };
};

export default useAddEditHorse;
