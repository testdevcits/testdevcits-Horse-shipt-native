import React from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image } from 'react-native';
import { MapPin, Calendar, Camera, Upload, Trash2, Edit2, CheckCircle2 } from 'lucide-react-native';
import styles from './styles.newshipment';
import { AppText, ConfirmationModal } from '../../../../components';
import { COLORS } from '../../../../constants';
import useNewShipment, { STEPS } from './useNewShipment';
import PickupStep from './stepsscreens/PickupStep';


const NewShipment = () => {
  const {
    currentStep, form, updateForm, nextStep, prevStep,
    isPublishModalVisible, setIsPublishModalVisible, handlePublish, loading
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

  const renderPickupStep = () => (
     
    <PickupStep form={form} updateForm={updateForm} />
  );

  const renderHorseDetails = () => (
    <ScrollView style={styles.content}>
      <AppText style={styles.label}>Horse 1: {form.horses[0].registeredName || 'New Horse'}</AppText>
      <View style={styles.card}>
        <TextInput
          placeholder="Registered Name"
          style={styles.input}
          onChangeText={(t) => {
            let h = [...form.horses];
            h[0].registeredName = t;
            updateForm({ horses: h });
          }}
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <AppText style={styles.label}>Age</AppText>
            <TextInput placeholder="1" style={styles.input} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.label}>Sex</AppText>
            <TextInput placeholder="Stallion" style={styles.input} />
          </View>
        </View>
        <AppText style={styles.label}>Additional Notes</AppText>
        <TextInput
          multiline
          numberOfLines={4}
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Enter notes here..."
        />
      </View>
    </ScrollView>
  );

  const renderReview = () => (
    <ScrollView style={styles.content}>
      <View style={styles.card}>
        <View style={styles.summaryHeader}>
          <AppText style={styles.label}>Pickup & Delivery Details</AppText>
          <Edit2 size={16} color={COLORS.goldPrimary} />
        </View>
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MapPin size={16} color={COLORS.goldPrimary} />
            <View>
              <AppText style={styles.label}>Pickup:</AppText>
              <AppText>{form.pickupLocation}</AppText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MapPin size={16} color={COLORS.secondary} />
            <View>
              <AppText style={styles.label}>Delivery:</AppText>
              <AppText>{form.deliveryLocation}</AppText>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>New Shipment</AppText>
        <TouchableOpacity><AppText style={styles.cancelBtn}>Cancel</AppText></TouchableOpacity>
      </View>

      {renderStepper()}

      <View style={{ flex: 1 }}>
        {currentStep === 0 && renderPickupStep()}
        {currentStep === 2 && renderHorseDetails()}
        {currentStep === 4 && renderReview()}
      </View>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity style={[styles.btn, styles.btnPrev]} onPress={prevStep}>
            <AppText style={styles.btnTextPrev}>Previous</AppText>
          </TouchableOpacity>
        )}

        {currentStep < STEPS.length - 1 ? (
          <TouchableOpacity style={[styles.btn, styles.btnNext]} onPress={nextStep}>
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