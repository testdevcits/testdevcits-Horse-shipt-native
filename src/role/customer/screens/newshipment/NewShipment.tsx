import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Trash2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import styles from './styles.newshipment';
import { COLORS } from '../../../../constants';
import { AppHeader, AppText, ConfirmationModal } from '../../../../components';
import { useAppDispatch } from '../../../../hooks/redux';
import { deleteCustomerShipment } from '../../../../redux/slices/customerShipmentSlice';
import useNewShipment, { STEPS } from './useNewShipment';
import PickupStep from './stepsscreens/PickupStep';
import DeliveryStep from './stepsscreens/DeliveryStep';
import HorseDetailsStep from './stepsscreens/HorseDetailsStep';
import ReviewStep from './stepsscreens/ReviewStep';
import ShipmentInfoStep from './stepsscreens/ShipmentInfoStep';
import DraftSuccessModal from './DraftSuccessModal';

const NewShipment = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const isEdit = route.params?.isEdit;
  const shipmentData = route.params?.shipmentData;

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    draftLoading,
    publishLoading,
    isPublishModalVisible,
    setIsPublishModalVisible,
    isDraftModalVisible,
    setIsDraftModalVisible,
    setCurrentStep,
  } = useNewShipment();

  const handleConfirmDelete = async () => {
    const targetId = shipmentData?._id;
    if (!targetId) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteCustomerShipment(targetId)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Draft Deleted',
        text2: 'Draft shipment deleted successfully.',
      });
      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: err || 'Failed to delete draft shipment',
      });
      setIsDeleting(false);
      setIsDeleteModalVisible(false);
    }
  };

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
      <AppHeader
        showBack={true}
        title={isEdit ? 'Edit Shipment' : 'New Shipment'}
        rightElement={
          isEdit && shipmentData?._id ? (
            <TouchableOpacity
              onPress={() => setIsDeleteModalVisible(true)}
              style={{ padding: 6 }}
            >
              <Trash2 size={20} color={COLORS.error} />
            </TouchableOpacity>
          ) : undefined
        }
      />
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
              loading={loading}
              draftLoading={draftLoading}
              publishLoading={publishLoading}
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

      {/* DRAFT DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        type="danger"
        title="Delete Draft Shipment?"
        description="Are you sure you want to delete this draft shipment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalVisible(false);
          }
        }}
        onConfirm={handleConfirmDelete}
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
