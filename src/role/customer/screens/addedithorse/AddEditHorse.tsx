import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Formik } from 'formik';

import { HorseSchema } from './schema';
import { AppHeader, AppLoader, AppText } from '../../../../components';
import AppButton from '../../../../components/common/Button/AppButton';

import imageIndex from '../../../../assets/images/imageIndex';
import HorseActionModal from './HorseActionModal';
import styles from './styles.AddEditHorses';
import HorseDocumentPickerSection from './components/HorseDocumentPickerSection';
import { HorsePhotoPickerSection } from './components/HorsePhotoPickerSection';
import { HorseFormFieldsSection } from './components/HorseFormFieldsSection';
import useAddEditHorse from './useAddEditHorse';

const AddEditHorse = () => {
  const {
    isSaving,
    isPicking,
    colorOptions,
    initialValues,
    handlePickPhoto,
    handlePickDocument,
    handleSubmit,
    navigation,
    isEdit,
    _loading,
  } = useAddEditHorse();

  return (
    <View style={styles.container}>
      <AppHeader
        title={isEdit ? 'Edit Horse' : 'Add New Horse'}
        showBack
        onBack={() => navigation.goBack()}
      />
      <AppLoader visible={_loading} />

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
                source={imageIndex?.addedithorseiocn}
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
              handleSubmit: formikSubmit,
            }) => (
              <View style={styles.form}>
                {/* Photo Upload Section */}
                <HorsePhotoPickerSection
                  photo={values?.photo}
                  isPicking={isPicking}
                  onPickPhoto={() => handlePickPhoto(setFieldValue)}
                  onRemovePhoto={() => setFieldValue('photo', null)}
                />

                {/* Form Fields Section */}
                <HorseFormFieldsSection
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  colorOptions={colorOptions}
                />
                {/* Documents Upload Section */}
                <HorseDocumentPickerSection
                  coggins={values?.coggins}
                  healthCertificate={values?.healthCertificate}
                  isPicking={isPicking}
                  isEdit={isEdit}
                  onPickDocument={field =>
                    handlePickDocument(field, setFieldValue)
                  }
                  onRemoveDocument={field => setFieldValue(field, null)}
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
                    onPress={() => formikSubmit()}
                    buttonStyle={styles.addBtn}
                  />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>

        <HorseActionModal
          visible={isSaving}
          title={isEdit ? 'Updating Horse' : 'Adding Horse'}
          description={
            isEdit
              ? 'Updating your horse... Please wait while we save the details.'
              : 'Adding your horse... Please wait while we save the details.'
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddEditHorse;
