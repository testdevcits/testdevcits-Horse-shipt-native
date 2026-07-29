import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles.newshipment';
import { AppHeader, ConfirmationModal } from '../../../../components';
import useNewShipment, { STEPS } from './useNewShipment';
import PickupStep from './stepsscreens/PickupStep';
import DeliveryStep from './stepsscreens/DeliveryStep';
import HorseDetailsStep from './stepsscreens/HorseDetailsStep';
import ReviewStep from './stepsscreens/ReviewStep';
import ShipmentInfoStep from './stepsscreens/ShipmentInfoStep';
import DraftSuccessModal from './DraftSuccessModal';

const NewShipment = () => {
  const navigation = useNavigation();
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
      {STEPS.map((_, index) => (
        <View
          key={index}
          style={[styles.stepBar, index <= currentStep && styles.stepBarActive]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      {renderStepper()}
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
