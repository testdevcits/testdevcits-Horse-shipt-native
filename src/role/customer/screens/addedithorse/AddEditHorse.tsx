import React, { useState, lazy, Suspense } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { breedsList, sexes, stallTypes } from './constants';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setHorses } from '../../../../redux/slices/horseSlice';
import imageIndex from '../../../../assets/images/imageIndex';
import HorseActionModal from './HorseActionModal';

const AppSelect = lazy(() =>
  import('../../../../components').then(module => ({
    default: module.AppSelect,
  })),
);

const AddEditHorse = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const horse = (route.params as any)?.horse;
  const isEdit = !!horse;

  const initialValues = {
    registeredName: horse?.registeredName || '',
    barnName: horse?.barnName || '',
    colour: horse?.colour || '',
    age: horse?.age || '',
    breed: horse?.breed || '',
    sex: horse?.sex || '',
    defaultStallSize: horse?.defaultStallSize || '',
    notes: horse?.notes || '',
  };

  const handleSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      if (isEdit) {
        await customerService.updateHorse(horse._id, values);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Horse updated successfully',
        });
      } else {
        await customerService.addHorse(values);
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

                <AppSelect
                  label={'Color'}
                  placeholder="Select Color"
                  options={[
                    'Bay',
                    'Black',
                    'Chestnut',
                    'Grey',
                    'Palomino',
                    'Other',
                  ]}
                  value={values.colour}
                  onSelect={item => setFieldValue('colour', item)}
                  error={touched.colour ? (errors.colour as string) : ''}
                />

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
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
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
    backgroundColor: COLORS.goldPrimary,
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
