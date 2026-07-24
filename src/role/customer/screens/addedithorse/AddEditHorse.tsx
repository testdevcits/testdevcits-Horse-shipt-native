import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS, FONTS } from '../../../../constants';

import { HorseSchema } from './schema';
import {
  AppHeader,
  AppLoader,
  AppSelect,
  Input,
  AppText,
} from '../../../../components';
import AppButton from '../../../../components/common/Button/AppButton';
import customerService from '../../../../api/services/customerService';
import { breedsList, sexes, stallTypes } from './constants';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setHorses } from '../../../../redux/slices/horseSlice';
import imageIndex from '../../../../assets/images/imageIndex';
import HorseActionModal from './HorseActionModal';

const AddEditHorse = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const horse = route.params?.horse;
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
    setIsSaving(true); // This will trigger the HorseActionModal
    // setLoading(true);
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
      // setLoading(false);
      setIsSaving(false);
    }
  };

  // Helper to render label with red asterisk
  const renderLabel = (text: string) => (
    <AppText style={styles.inputLabel}>
      {text} <AppText style={{ color: COLORS.error }}>*</AppText>
    </AppText>
  );

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
              {/* Replace with your horse icon asset */}
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
                  error={touched.registeredName ? errors.registeredName : ''}
                />

                <Input
                  label={'Barn Name'}
                  placeholder="Enter Barn name ( min 3 characters )"
                  value={values.barnName}
                  onChangeText={handleChange('barnName')}
                  error={touched.barnName ? errors.barnName : ''}
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
                  error={touched.age ? errors.age : ''}
                />

                <AppSelect
                  label={'Breed'}
                  placeholder="Select Breed"
                  options={breedsList}
                  value={values.breed}
                  searchable
                  onSelect={item => setFieldValue('breed', item)}
                  error={touched.breed ? (errors.breed as string) : ''}
                />

                <AppSelect
                  label={'Sex'}
                  placeholder="Select Sex"
                  options={sexes}
                  value={values.sex}
                  onSelect={item => setFieldValue('sex', item)}
                  error={touched.sex ? (errors.sex as string) : ''}
                />

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

                <Input
                  label={'Notes (General Info)'}
                  placeholder="Enter Notes about horse"
                  multiline
                  numberOfLines={5}
                  // containerStyle={styles.notesInput}
                  value={values.notes}
                  onChangeText={handleChange('notes')}
                  error={touched.notes ? errors.notes : ''}
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
  scroll: { padding: SPACING.lg },
  topHeader: { marginBottom: SPACING.lg },
  mainTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subTitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF6EE',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 30,
    height: 30,

    tintColor: COLORS.primary,
  }, // Replace with Asset
  infoTextContainer: { flex: 1, marginLeft: SPACING.md },
  infoTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  infoDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },

  form: { gap: SPACING.xs },
  inputLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  notesInput: { height: 120, textAlignVertical: 'top' },

  btnContainer: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    paddingBottom: 40,
  },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.goldPrimary,
    borderRadius: RADIUS.sm,
    height: 50,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    height: 50,
  },
  cancelBtnText: { color: COLORS.textPrimary, fontFamily: FONTS.bold },
});

export default AddEditHorse;
