import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../../../../constants';

// Common Components

import { HorseSchema } from './schema';
import { AppHeader, AppLoader, AppSelect, Input } from '../../../../components';
import AppButton from '../../../../components/common/Button/AppButton';
import customerService from '../../../../api/services/customerService';
import { breedsList, sexes, stallTypes } from './constants'; // Import your arrays

const AddEditHorse = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);

  // Check if we are in Edit Mode
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
    setLoading(true);
    try {
      if (isEdit) {
        await customerService.updateHorse(horse._id, values);
        Alert.alert('Success', 'Horse updated successfully');
      } else {
        await customerService.addHorse(values);
        Alert.alert('Success', 'Horse added successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={HorseSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View>
                {/* Standard Inputs for Names */}
                <Input
                  label="Registered Name *"
                  value={values.registeredName}
                  onChangeText={handleChange('registeredName')}
                  error={touched.registeredName ? errors.registeredName : ''}
                />

                <Input
                  label="Barn Name *"
                  value={values.barnName}
                  onChangeText={handleChange('barnName')}
                  error={touched.barnName ? errors.barnName : ''}
                />

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: SPACING.sm }}>
                    {/* Replace Colour Input with Select if you have a list, or keep as Input */}
                    <Input
                      label="Colour *"
                      placeholder="e.g. Bay, White"
                      value={values.colour}
                      onChangeText={handleChange('colour')}
                      error={touched.colour ? errors.colour : ''}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                    <Input
                      label="Age (years) *"
                      placeholder="Enter age"
                      keyboardType="numeric"
                      value={values.age}
                      onChangeText={handleChange('age')}
                      error={touched.age ? errors.age : ''}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: SPACING.sm }}>
                    <AppSelect
                      label="Breed *"
                      placeholder="Select breed"
                      options={breedsList}
                      value={values.breed}
                      searchable // Long list needs search
                      onSelect={item => setFieldValue('breed', item)}
                      error={touched.breed ? (errors.breed as string) : ''}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                    <AppSelect
                      label="Sex *"
                      placeholder="Select sex"
                      options={sexes}
                      value={values.sex}
                      onSelect={item => setFieldValue('sex', item)}
                      error={touched.sex ? (errors.sex as string) : ''}
                    />
                  </View>
                </View>

                <AppSelect
                  label="Stall Type *"
                  placeholder="Select stall type"
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
                  label="Notes (General Info) *"
                  multiline
                  numberOfLines={4}
                  value={values.notes}
                  onChangeText={handleChange('notes')}
                  error={touched.notes ? errors.notes : ''}
                />
                <View style={styles.btnContainer}>
                  <AppButton
                    title={isEdit ? 'Update Horse' : 'Add Horse'}
                    onPress={() => handleSubmit()}
                    buttonStyle={styles.addBtn}
                  />
                  <AppButton
                    title="Cancel"
                    onPress={() => navigation.goBack()}
                    buttonStyle={styles.cancelBtn}
                    textStyle={{ color: COLORS.textPrimary }}
                  />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: SPACING.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btnContainer: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  addBtn: {
    flex: 1.5,
    backgroundColor: COLORS.goldPrimary,
    borderRadius: RADIUS.sm,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
  },
});

export default AddEditHorse;
