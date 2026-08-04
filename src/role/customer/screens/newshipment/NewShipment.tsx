import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import styles from './styles.newshipment';
import { AppHeader, AppText, ConfirmationModal } from '../../../../components';
import useNewShipment, { STEPS } from './useNewShipment';
import PickupStep from './stepsscreens/PickupStep';
import DeliveryStep from './stepsscreens/DeliveryStep';
import HorseDetailsStep from './stepsscreens/HorseDetailsStep';
import ReviewStep from './stepsscreens/ReviewStep';
import ShipmentInfoStep from './stepsscreens/ShipmentInfoStep';
import DraftSuccessModal from './DraftSuccessModal';

const NewShipment = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const isEdit = route.params?.isEdit;

  const {
    currentStep,
    form,
    updateForm,
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
  } = useNewShipment();

  const renderStepper = () => (
    <View style={styles.stepperContainer}>
      {STEPS.map((stepLabel, index) => {
        const isActive = index <= currentStep;
        const isCurrent = index === currentStep;
        return (
          <View key={index} style={styles.stepItem}>
            <View
              style={[
                styles.stepBar,
                isActive && styles.stepBarActive,
                isCurrent && styles.stepBarCurrent,
              ]}
            />
            <AppText
              style={[
                styles.stepLabelText,
                isActive && styles.stepLabelTextActive,
                isCurrent && styles.stepLabelTextCurrent,
              ]}
              numberOfLines={1}
            >
              {stepLabel}
            </AppText>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title={isEdit ? "Edit Shipment" : "New Shipment"} />
      {renderStepper()}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>


        <View style={{ flex: 1 }}>
          {currentStep === 0 && (
            <PickupStep
              form={form}
              updateForm={updateForm}
              errors={errors}
              onNext={nextStep}
              onPrevious={() => navigation.goBack()}
            />
          )}
          {currentStep === 1 && (
            <DeliveryStep
              form={form}
              updateForm={updateForm}
              errors={errors}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}
          {currentStep === 2 && (
            <HorseDetailsStep
              form={form}
              updateForm={updateForm}
              errors={errors}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}
          {currentStep === 3 && (
            <ShipmentInfoStep
              form={form}
              updateForm={updateForm}
              pickImage={pickImage}
              pickDocument={pickDocument}
              onNext={nextStep}
              onPrevious={prevStep}
              removeFile={removeFile}
            />
          )}
          {currentStep === 4 && (
            <ReviewStep
              form={form}
              onPublish={() => setIsPublishModalVisible(true)}
              onSaveDraft={handleSaveDraft}
              onEditSection={stepIndex => setCurrentStep(stepIndex)}
            />
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        isVisible={isPublishModalVisible}
        onClose={() => setIsPublishModalVisible(false)}
        onConfirm={handlePublish}
        title="Publish Shipment?"
        description="Are you sure you want to save and publish this shipment? Pickup and Horse details cannot be edited later."
        confirmText="Save & Publish"
        isLoading={loading}
      />

      <DraftSuccessModal
        visible={isDraftModalVisible}
        onReview={() => {
          setIsDraftModalVisible(false);
          setIsPublishModalVisible(true);
        }}
        onDashboard={() => {
          setIsDraftModalVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default NewShipment;
