import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  MapPin,
  Calendar,
  Camera,
  Upload,
  Trash2,
  Edit2,
  CheckCircle2,
} from 'lucide-react-native';
import styles from './styles.newshipment';
import { AppHeader, AppText, ConfirmationModal } from '../../../../components';
import { COLORS } from '../../../../constants';
import useNewShipment, { STEPS } from './useNewShipment';
import PickupStep from './stepsscreens/PickupStep';
import DeliveryStep from './stepsscreens/DeliveryStep';
import HorseDetailsStep from './stepsscreens/HorseDetailsStep';
import ReviewStep from './stepsscreens/ReviewStep';
import ShipmentInfoStep from './stepsscreens/ShipmentInfoStep';

const NewShipment = () => {
  const {
    currentStep,
    form,
    updateForm,
    nextStep,
    prevStep,
    errors,
    pickImage,
    pickDocument,
    handlePublish,
    loading,
    isPublishModalVisible,
    setIsPublishModalVisible,
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
          />
        )}
        {currentStep === 1 && (
          <DeliveryStep
            form={form}
            updateForm={updateForm}
            errors={errors}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <HorseDetailsStep
            form={form}
            updateForm={updateForm}
            errors={errors}
            onNext={nextStep}
          />
        )}
        {currentStep === 3 && (
          <ShipmentInfoStep
            form={form}
            updateForm={updateForm}
            pickImage={pickImage}
            pickDocument={pickDocument}
            onNext={nextStep}
          />
        )}
        {currentStep === 4 && (
          <ReviewStep
            form={form}
            onPublish={() => setIsPublishModalVisible(true)}
          />
        )}
      </View>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={[styles.btn, styles.btnPrev]}
            onPress={prevStep}
          >
            <AppText style={styles.btnTextPrev}>Previous</AppText>
          </TouchableOpacity>
        )}

        {currentStep < STEPS.length - 1 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btnNext]}
            onPress={nextStep}
          >
            <AppText style={styles.btnText}>Next</AppText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, styles.btnNext]}
            onPress={() => setIsPublishModalVisible(true)}
          >
            <AppText style={styles.btnText}>Publish Shipment</AppText>
          </TouchableOpacity>
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
    </View>
  );
};

export default NewShipment;
