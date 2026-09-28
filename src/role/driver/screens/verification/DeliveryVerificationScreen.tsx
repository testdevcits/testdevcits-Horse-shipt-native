import React, { lazy, Suspense } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { COLORS } from '../../../../constants';
import AppText from '../../../../components/common/AppText';
import styles from './styles.deliveryverification';
import AppIcon from '../../../../components/app_icon/AppIcon';
import useDeliveryVerification from './useDeliveryVerification';
import DeliveryShipmentCard from './components/DeliveryShipmentCard';
import DeliveryStepContent from './components/DeliveryStepContent';

const ProgressStepper: React.FC<{ step: number }> = ({ step }) => (
  <View style={styles.stepperContainer}>
    {/* Step 1 */}
    <View style={styles.stepWrapper}>
      <View
        style={[
          styles.stepCircle,
          step > 1 && styles.stepCircleCompleted,
          step === 1 && styles.stepCircleActive,
        ]}
      >
        {step > 1 ? (
          <AppIcon name="Check" size={14} color={COLORS.white} />
        ) : (
          <AppText
            style={[styles.stepNumber, step === 1 && styles.stepNumberActive]}
          >
            1
          </AppText>
        )}
      </View>
      <AppText style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>
        Send OTP
      </AppText>
    </View>

    <View style={[styles.stepLine, step > 1 && styles.stepLineCompleted]} />

    {/* Step 2 */}
    <View style={styles.stepWrapper}>
      <View
        style={[
          styles.stepCircle,
          step > 2 && styles.stepCircleCompleted,
          step === 2 && styles.stepCircleActive,
        ]}
      >
        {step > 2 ? (
          <AppIcon name="Check" size={14} color={COLORS.white} />
        ) : (
          <AppText
            style={[styles.stepNumber, step === 2 && styles.stepNumberActive]}
          >
            2
          </AppText>
        )}
      </View>
      <AppText style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>
        Verify OTP
      </AppText>
    </View>

    <View style={[styles.stepLine, step > 2 && styles.stepLineCompleted]} />

    {/* Step 3 */}
    <View style={styles.stepWrapper}>
      <View style={[styles.stepCircle, step === 3 && styles.stepCircleActive]}>
        <AppText
          style={[styles.stepNumber, step === 3 && styles.stepNumberActive]}
        >
          3
        </AppText>
      </View>
      <AppText style={[styles.stepLabel, step === 3 && styles.stepLabelActive]}>
        Mark Done
      </AppText>
    </View>
  </View>
);

const DeliveryVerificationScreen = () => {
  const ConfirmationModal = lazy(
    () =>
      import(
        '../../../../components/common/ConfirmationModal/ConfirmationModal'
      ),
  );
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Extract shipment details from navigation parameters
  const shipment = route.params?.shipment || {};

  const {
    step,
    isLoading,
    otpSentSuccess,
    setOtp,
    modalConfig,
    handleVerifyOtp,
    handleSendOtp,
    handleDone,
    otp,
    setModalConfig,
  } = useDeliveryVerification({ shipment, navigation });

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        {/* Navigation Header */}
        <View style={styles.navBar}>
          {step < 3 && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AppIcon name="ArrowLeft" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
          <View style={styles.navTitleContainer}>
            <AppText style={styles.navTitle}>Delivery Verification</AppText>
            <AppText style={styles.navSubtitle}>Step {step} of 3</AppText>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Stepper Node Progress Indicator */}
          <ProgressStepper step={step} />

          {/* Shipment Details Box */}
          <DeliveryShipmentCard shipment={shipment} />

          {/* DYNAMIC VIEWS ACCORDING TO STEPPER */}
          <DeliveryStepContent
            step={step}
            otpSentSuccess={otpSentSuccess}
            otp={otp}
            setOtp={setOtp}
            onSendOtp={handleSendOtp}
          />
        </ScrollView>

        {/* Footer Fixed Action Buttons */}
        <View style={styles.footerContainer}>
          {step === 1 && (
            <TouchableOpacity
              style={styles.goldActionButton}
              onPress={handleSendOtp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <AppIcon
                    name="Send"
                    size={18}
                    color={COLORS.white}
                    style={styles.actionBtnIcon}
                  />
                  <AppText style={styles.actionBtnText}>
                    Send OTP to Customer
                  </AppText>
                </>
              )}
            </TouchableOpacity>
          )}

          {step === 2 && (
            <TouchableOpacity
              style={styles.goldActionButton}
              onPress={handleVerifyOtp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <AppIcon
                    name="Check"
                    size={18}
                    color={COLORS.white}
                    style={styles.actionBtnIcon}
                  />
                  <AppText style={styles.actionBtnText}>Verify OTP</AppText>
                </>
              )}
            </TouchableOpacity>
          )}

          {step === 3 && (
            <TouchableOpacity
              style={[
                styles.goldActionButton,
                { backgroundColor: COLORS.greenSuccess },
              ]}
              onPress={handleDone}
              activeOpacity={0.8}
            >
              <AppIcon
                name="Check"
                size={18}
                color={COLORS.white}
                style={styles.actionBtnIcon}
              />
              <AppText style={styles.actionBtnText}>Complete Manifest</AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* Alert Dialog confirmation slot */}
        <Suspense fallback={null}>
          <ConfirmationModal
            isVisible={modalConfig.isVisible}
            onClose={() =>
              setModalConfig(prev => ({ ...prev, isVisible: false }))
            }
            onConfirm={() =>
              setModalConfig(prev => ({ ...prev, isVisible: false }))
            }
            title={modalConfig.title}
            description={modalConfig.description}
            type={modalConfig.type}
            confirmText="Got It"
            cancelText="Close"
          />
        </Suspense>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DeliveryVerificationScreen;
