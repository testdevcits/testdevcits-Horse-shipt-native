import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { pick, types } from '@react-native-documents/picker';
import { Camera, Trash2, Upload, Paperclip } from 'lucide-react-native';

import {
  COLORS,
  SPACING,
  RADIUS,
  FONTS,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../constants';

import { HorseSchema } from './schema';
import { AppHeader, AppLoader, Input, AppText } from '../../../../components';
import AppButton from '../../../../components/common/Button/AppButton';
import customerService from '../../../../api/services/customerService';
import { breedsList, sexes, stallTypes, defaultColors } from './constants';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setHorses } from '../../../../redux/slices/horseSlice';
import imageIndex from '../../../../assets/images/imageIndex';
import HorseActionModal from './HorseActionModal';
import { Horse } from '../../../../types/customer';

const AppSelect = lazy(() =>
  import('../../../../components').then(module => ({
    default: module.AppSelect,
  })),
);

const AddEditHorse = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
            const merged = Array.from(new Set([...activeColors, ...defaultColors]));
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
    defaultStallSize: horse?.defaultStallSize || '',
    notes: horse?.notes || '',
    photo: horse?.photo || null,
    coggins: horse?.documents?.coggins || null,
    healthCertificate: horse?.documents?.healthCertificate || null,
  };

  const handlePickPhoto = async (setFieldValue: (field: string, val: any) => void) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        mediaType: 'photo',
      });
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
    }
  };

  const handlePickDocument = async (
    field: 'coggins' | 'healthCertificate',
    setFieldValue: (field: string, val: any) => void,
  ) => {
    try {
      const [result] = await pick({ type: [types.pdf] });
      if (!result) return;
      const rawName = result.name || `${field}.pdf`;
      const pdfName = rawName.toLowerCase().endsWith('.pdf') ? rawName : `${rawName}.pdf`;
      setFieldValue(field, {
        uri: result.uri,
        type: 'application/pdf',
        name: pdfName,
      });
    } catch (error: any) {
      if (error?.code !== 'DOCUMENT_PICKER_CANCELED') {
        console.log('Document picker error:', error);
      }
    }
  };

  const handleSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('registeredName', values.registeredName);
      formData.append('barnName', values.barnName);
      formData.append('colour', values.colour);
      formData.append('age', values.age);
      formData.append('breed', values.breed);
      formData.append(
        'otherBreed',
        values.breed === 'Other' || values.breed === 'Other Breed'
          ? values.otherBreed
          : (values.otherBreed || ''),
      );
      formData.append('sex', values.sex);
      formData.append('stallType', values.defaultStallSize);
      formData.append('notes', values.notes || '');

      if (values.photo && values.photo.uri) {
        formData.append('photo', {
          uri: values.photo.uri,
          type: values.photo.type || 'image/jpeg',
          name: values.photo.name || 'photo.jpg',
        } as any);
      }

      if (values.coggins && values.coggins.uri) {
        const rawName = values.coggins.name || 'coggins.pdf';
        const pdfName = rawName.toLowerCase().endsWith('.pdf') ? rawName : `${rawName}.pdf`;
        formData.append('coggins', {
          uri: values.coggins.uri,
          type: 'application/pdf',
          name: pdfName,
        } as any);
      }

      if (values.healthCertificate && values.healthCertificate.uri) {
        const rawName = values.healthCertificate.name || 'healthCertificate.pdf';
        const pdfName = rawName.toLowerCase().endsWith('.pdf') ? rawName : `${rawName}.pdf`;
        formData.append('healthCertificate', {
          uri: values.healthCertificate.uri,
          type: 'application/pdf',
          name: pdfName,
        } as any);
      }

      if (isEdit && horse?._id) {
        await customerService.updateHorse(horse._id, formData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Horse updated successfully',
        });
      } else {
        await customerService.addHorse(formData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Horse added successfully',
        });
      }
      const response = await customerService.getHorses();
      if (response.success) {
        dispatch(setHorses(response.horses));
      }
      navigation.goBack();
    } catch (error: any) {
      console.log('Error submitting horse:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={isEdit ? 'Edit Horse' : 'Add New Horse'}
        showBack
        onBack={() => navigation.goBack()}
      />
      <AppLoader visible={loading} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title Section */}
          <View style={styles.topHeader}>
            <AppText style={styles.mainTitle}>My Horses</AppText>
            <AppText style={styles.subTitle}>
              Manage your horses, update their details, and keep all
              transportation information in one place.
            </AppText>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Image
                source={imageIndex.addedithorseiocn}
                style={styles.placeholderIcon}
                resizeMode="center"
              />
            </View>
            <View style={styles.infoTextContainer}>
              <AppText style={styles.infoTitle}>Horse Details</AppText>
              <AppText style={styles.infoDesc}>
                Tell us about your horse(s) so we can ensure a safe and
                comfortable journey.
              </AppText>
            </View>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={HorseSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              setFieldValue,
              values,
              errors,
              touched,
              handleSubmit,
            }) => (
              <View style={styles.form}>
                {/* Photo Upload Section */}
                <View style={styles.sectionCard}>
                  <AppText style={styles.sectionTitle}>Horse Photo</AppText>
                  <View style={styles.photoContainer}>
                    {values.photo?.uri || values.photo?.url ? (
                      <View style={styles.photoPreviewBox}>
                        <Image
                          source={{ uri: values.photo.uri || values.photo.url }}
                          style={styles.photoPreviewImage}
                        />
                        <TouchableOpacity
                          style={styles.removePhotoBadge}
                          onPress={() => setFieldValue('photo', null)}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={14} color={COLORS.white} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={() => handlePickPhoto(setFieldValue)}
                        activeOpacity={0.7}
                      >
                        <Camera size={26} color={COLORS.primary} />
                        <AppText style={styles.uploadBoxText}>Upload Photo</AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <Input
                  label={'Registered Name'}
                  placeholder="Enter Registered name ( min 3 characters )"
                  value={values.registeredName}
                  onChangeText={handleChange('registeredName')}
                  error={
                    touched.registeredName ? (errors.registeredName as string) : ''
                  }
                />

                <Input
                  label={'Barn Name'}
                  placeholder="Enter Barn name ( min 3 characters )"
                  value={values.barnName}
                  onChangeText={handleChange('barnName')}
                  error={touched.barnName ? (errors.barnName as string) : ''}
                />

                <Suspense fallback={<ActivityIndicator size={'small'} />}>
                  <AppSelect
                    label={'Color'}
                    placeholder="Select Color"
                    options={colorOptions}
                    value={values.colour}
                    searchable
                    onSelect={item => setFieldValue('colour', item)}
                    error={touched.colour ? (errors.colour as string) : ''}
                  />
                </Suspense>

                <Input
                  label={'Age (years)'}
                  placeholder="Enter age"
                  keyboardType="numeric"
                  value={values.age}
                  onChangeText={handleChange('age')}
                  maxLength={2}
                  error={touched.age ? (errors.age as string) : ''}
                />

                <Suspense fallback={<ActivityIndicator size={'small'} />}>
                  <AppSelect
                    label={'Breed'}
                    placeholder="Select Breed"
                    options={breedsList}
                    value={values.breed}
                    searchable
                    onSelect={item => setFieldValue('breed', item)}
                    error={touched.breed ? (errors.breed as string) : ''}
                  />
                </Suspense>

                {(values.breed === 'Other' || values.breed === 'Other Breed') && (
                  <Input
                    label={'Other Breed'}
                    placeholder="Enter custom breed name"
                    value={values.otherBreed}
                    onChangeText={handleChange('otherBreed')}
                    error={touched.otherBreed ? (errors.otherBreed as string) : ''}
                  />
                )}

                <Suspense fallback={<ActivityIndicator size={'small'} />}>
                  <AppSelect
                    label={'Sex'}
                    placeholder="Select Sex"
                    options={sexes}
                    value={values.sex}
                    onSelect={item => setFieldValue('sex', item)}
                    error={touched.sex ? (errors.sex as string) : ''}
                  />
                </Suspense>

                <Suspense fallback={<ActivityIndicator size={'small'} />}>
                  <AppSelect
                    label={'Stall Type'}
                    placeholder="Select Stall Type"
                    options={stallTypes}
                    value={values.defaultStallSize}
                    onSelect={item => setFieldValue('defaultStallSize', item)}
                    error={
                      touched.defaultStallSize
                        ? (errors.defaultStallSize as string)
                        : ''
                    }
                  />
                </Suspense>

                <Input
                  label={'Notes (General Info)'}
                  placeholder="Enter Notes about horse"
                  multiline
                  numberOfLines={4}
                  value={values.notes}
                  onChangeText={handleChange('notes')}
                  error={touched.notes ? (errors.notes as string) : ''}
                />

                {/* Documents Upload Section */}
                <View style={styles.sectionCard}>
                  <AppText style={styles.sectionTitle}>Documents (PDF only)</AppText>

                  {/* Coggins Row */}
                  <View style={styles.docRow}>
                    <View style={styles.docLeft}>
                      <Paperclip size={18} color={COLORS.primary} />
                      <View style={styles.docTextWrap}>
                        <AppText style={styles.docLabel}>Coggins Test</AppText>
                        <AppText style={styles.docSubtext} numberOfLines={1}>
                          {values.coggins?.name ||
                            values.coggins?.originalName ||
                            'No document selected'}
                        </AppText>
                      </View>
                    </View>
                    {values.coggins ? (
                      <TouchableOpacity
                        style={styles.docDeleteBtn}
                        onPress={() => setFieldValue('coggins', null)}
                      >
                        <Trash2 size={16} color={COLORS.error} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.docUploadBtn}
                        onPress={() => handlePickDocument('coggins', setFieldValue)}
                      >
                        <Upload size={14} color={COLORS.primary} />
                        <AppText style={styles.docUploadBtnText}>Upload</AppText>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Health Certificate Row */}
                  <View style={[styles.docRow, { borderBottomWidth: 0 }]}>
                    <View style={styles.docLeft}>
                      <Paperclip size={18} color={COLORS.primary} />
                      <View style={styles.docTextWrap}>
                        <AppText style={styles.docLabel}>Health Certificate</AppText>
                        <AppText style={styles.docSubtext} numberOfLines={1}>
                          {values.healthCertificate?.name ||
                            values.healthCertificate?.originalName ||
                            'No document selected'}
                        </AppText>
                      </View>
                    </View>
                    {values.healthCertificate ? (
                      <TouchableOpacity
                        style={styles.docDeleteBtn}
                        onPress={() => setFieldValue('healthCertificate', null)}
                      >
                        <Trash2 size={16} color={COLORS.error} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.docUploadBtn}
                        onPress={() =>
                          handlePickDocument('healthCertificate', setFieldValue)
                        }
                      >
                        <Upload size={14} color={COLORS.primary} />
                        <AppText style={styles.docUploadBtnText}>Upload</AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.btnContainer}>
                  <AppButton
                    title="Cancel"
                    onPress={() => navigation.goBack()}
                    buttonStyle={styles.cancelBtn}
                    textStyle={styles.cancelBtnText}
                  />
                  <AppButton
                    title={isEdit ? 'Update Horse' : 'Add Horse'}
                    onPress={() => handleSubmit()}
                    buttonStyle={styles.addBtn}
                  />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>

        <HorseActionModal visible={isSaving} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: SPACING.md },
  topHeader: { marginBottom: SPACING.sm },
  mainTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF6EE',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  infoTextContainer: { flex: 1, marginLeft: SPACING.sm },
  infoTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  infoDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 1 },

  form: { gap: SPACING.xs },

  sectionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginVertical: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xs,
  },
  uploadBox: {
    width: 110,
    height: 110,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadBoxText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    marginTop: 4,
  },
  photoPreviewBox: {
    position: 'relative',
    width: 110,
    height: 110,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderRadius: 12,
    padding: 4,
  },

  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.xs,
  },
  docTextWrap: {
    marginLeft: SPACING.xs,
    flex: 1,
  },
  docLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  docSubtext: {
    fontSize: FONT_SIZE.xs - 1,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  docUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  docUploadBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  docDeleteBtn: {
    padding: 6,
  },

  btnContainer: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingBottom: SPACING.xxxl,
  },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    height: 46,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    height: 46,
  },
  cancelBtnText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});

export default AddEditHorse;
