import React, { useState } from 'react';
import driverService from '../../../../api/services/driverService';
import { CommonActions } from '@react-navigation/native';

const useDeliveryVerification = ({ navigation, shipment }: any) => {
  // State Management
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);

  // 6-Digit OTP Box state
  const [otp, setOtp] = useState<string>('');

  // Confirmation modal states
  const [modalConfig, setModalConfig] = useState({
    isVisible: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'danger' | 'info' | 'warning',
  });

  // 1. Trigger API to Send OTP
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await driverService.sendDeliveryOtp(
        shipment?.shipment?._id,
      );
      if (response.success) {
        setOtpSentSuccess(true);
        setStep(2); // Progress to Verify Step
      }
    } catch (error: any) {
      setModalConfig({
        isVisible: true,
        title: 'OTP Failed',
        description:
          error?.message ||
          'Could not securely dispatch verification PIN code.',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Trigger API to Verify OTP
  const handleVerifyOtp = async () => {
    const otpCodeString = typeof otp === 'string' ? otp : (otp as any).join('');
    if (otpCodeString.length < 6) {
      setModalConfig({
        isVisible: true,
        title: 'Incomplete PIN',
        description: 'Please enter all 6 verification digits.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await driverService.verifyDeliveryOtp(
        shipment?.shipment?._id,
        otpCodeString,
      );
      if (response.success) {
        setStep(3); // Progress to Complete screen
      }
    } catch (error: any) {
      setModalConfig({
        isVisible: true,
        title: 'Verification Failed',
        description:
          error?.message || 'The verification code entered was incorrect.',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Return back to tabs/dashboard
  const handleDone = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'DriverTabs' }],
      }),
    );
  };

  return {
    step,
    isLoading,
    otpSentSuccess,
    setOtp,
    modalConfig,
    handleVerifyOtp,
    handleSendOtp,
    handleDone,
otp,
setModalConfig

  };
};

export default useDeliveryVerification;
