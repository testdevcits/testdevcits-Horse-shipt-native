import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,

    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { ArrowLeft, Check, Smartphone, Send, Milestone, CheckCircle2, User, Truck } from 'lucide-react-native';

import { COLORS, FONTS } from '../../../../constants';
import AppText from '../../../../components/common/AppText';
import ConfirmationModal from '../../../../components/common/ConfirmationModal';
import driverService from '../../../../api/services/driverService';
import styles from './styles.deliveryverification';



const DeliveryVerificationScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    // Extract shipment details from navigation parameters (fallback to mock structure if params are empty)
    const shipment = route.params?.shipment || {};



    // State Management
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSentSuccess, setOtpSentSuccess] = useState(false);

    // 6-Digit OTP Box state and references
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const otpInputsRef = useRef<Array<TextInput | null>>([]);

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
            const response = await driverService.sendDeliveryOtp(shipment?.shipment?._id);
            if (response.success) {
                setOtpSentSuccess(true);
                setStep(2); // Progress to Verify Step
            }
        } catch (error: any) {
            setModalConfig({
                isVisible: true,
                title: 'OTP Failed',
                description: error?.message || 'Could not securely dispatch verification PIN code.',
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Trigger API to Verify OTP
    const handleVerifyOtp = async () => {
        const otpCodeString = otp.join('');
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
            const response = await driverService.verifyDeliveryOtp(shipment?.shipment?._id, otpCodeString);
            if (response.success) {
                setStep(3); // Progress to Complete screen
            }
        } catch (error: any) {
            setModalConfig({
                isVisible: true,
                title: 'Verification Failed',
                description: error?.message || 'The verification code entered was incorrect.',
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for dynamic 6-digit input auto-shifting focus
    const handleOtpInput = (text: string, index: number) => {
        const cleanText = text.replace(/[^0-9]/g, '');
        const newOtp = [...otp];
        newOtp[index] = cleanText;
        setOtp(newOtp);

        // Auto-focus next input box if filled
        if (cleanText && index < 5) {
            otpInputsRef.current[index + 1]?.focus();
        }
    };

    // Backspace focus transition back
    const handleOtpKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputsRef.current[index - 1]?.focus();
        }
    };

    // Return back to tabs/dashboard
    const handleDone = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'DriverTabs' }],
            })
        );
    };

    // Stepper view subcomponent
    const ProgressStepper = () => (
        <View style={styles.stepperContainer}>
            {/* Step 1 */}
            <View style={styles.stepWrapper}>
                <View style={[
                    styles.stepCircle,
                    step > 1 && styles.stepCircleCompleted,
                    step === 1 && styles.stepCircleActive,
                ]}>
                    {step > 1 ? <Check size={14} color={COLORS.white} /> : <AppText style={[styles.stepNumber, step === 1 && styles.stepNumberActive]}>1</AppText>}
                </View>
                <AppText style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>Send OTP</AppText>
            </View>

            <View style={[styles.stepLine, step > 1 && styles.stepLineCompleted]} />

            {/* Step 2 */}
            <View style={styles.stepWrapper}>
                <View style={[
                    styles.stepCircle,
                    step > 2 && styles.stepCircleCompleted,
                    step === 2 && styles.stepCircleActive,
                ]}>
                    {step > 2 ? <Check size={14} color={COLORS.white} /> : <AppText style={[styles.stepNumber, step === 2 && styles.stepNumberActive]}>2</AppText>}
                </View>
                <AppText style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>Verify OTP</AppText>
            </View>

            <View style={[styles.stepLine, step > 2 && styles.stepLineCompleted]} />

            {/* Step 3 */}
            <View style={styles.stepWrapper}>
                <View style={[
                    styles.stepCircle,
                    step === 3 && styles.stepCircleActive,
                ]}>
                    <AppText style={[styles.stepNumber, step === 3 && styles.stepNumberActive]}>3</AppText>
                </View>
                <AppText style={[styles.stepLabel, step === 3 && styles.stepLabelActive]}>Mark Done</AppText>
            </View>
        </View>
    );

    return (
        <View style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flexOne}
            >
                {/* Navigation Header */}
                <View style={styles.navBar}>
                    {step < 3 && (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ArrowLeft size={22} color={COLORS.textPrimary} />
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
                    <ProgressStepper />

                    {/* Shipment Details Box */}
                    <View style={styles.shipmentCard}>
                        <AppText style={styles.shipmentHeaderLabel}>SHIPMENT DETAILS</AppText>

                        <View style={styles.shipmentTitleRow}>
                            <AppText style={styles.shipmentTitle}>{shipment.shipment.horses?.[0]?.registeredName || 'Test'}</AppText>
                            <View style={styles.passengerCountBadge}>
                                <AppText style={styles.badgeText}>
                                    {shipment.shipment.numberOfHorses} {shipment.shipment.numberOfHorses > 1 ? 'Horses' : 'Horse'}
                                </AppText>
                            </View>
                        </View>

                        {/* Pickup */}
                        <View style={styles.stopBox}>
                            <AppText style={styles.stopHeaderLabel}>PICKUP</AppText>
                            <AppText style={styles.stopName}>{shipment.shipment.pickupLocation}</AppText>
                        </View>

                        {/* Delivery */}
                        <View style={styles.stopBox}>
                            <AppText style={styles.stopHeaderLabel}>DELIVERY</AppText>
                            <AppText style={styles.stopName}>{shipment.shipment.deliveryLocation}</AppText>
                        </View>

                        {/* Metadata Fields */}
                        <View style={styles.metaRow}>
                            <User size={16} color={COLORS.textLight} style={styles.metaIcon} />
                            <View>
                                <AppText style={styles.metaLabel}>CUSTOMER</AppText>
                                <AppText style={styles.metaValue}>Customer name not available</AppText>
                            </View>
                        </View>

                        <View style={[styles.metaRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                            <Truck size={16} color={COLORS.textLight} style={styles.metaIcon} />
                            <View>
                                <AppText style={styles.metaLabel}>VEHICLE</AppText>
                                <AppText style={styles.metaValue}>{shipment.vehicle?.vehicleNumber || 'MP19-8890'}</AppText>
                            </View>
                        </View>
                    </View>

                    {/* DYNAMIC VIEWS ACCORDING TO STEPPER */}

                    {/* STEP 1: Ready to Deliver (Send OTP) */}
                    {step === 1 && (
                        <View style={styles.centerSection}>
                            <View style={styles.middleIconBox}>
                                <Milestone size={32} color={COLORS.goldPrimary} />
                            </View>
                            <AppText style={styles.mainActionHeading}>Ready to Deliver?</AppText>
                            <AppText style={styles.mainActionDescription}>
                                Send an OTP to the horse owner to confirm you've arrived at the delivery location.
                            </AppText>
                        </View>
                    )}

                    {/* STEP 2: Verify OTP View */}
                    {step === 2 && (
                        <View style={styles.centerSection}>
                            <View style={styles.middleIconBox}>
                                <Smartphone size={32} color={COLORS.goldPrimary} />
                            </View>
                            <AppText style={styles.mainActionHeading}>Enter OTP</AppText>
                            <AppText style={styles.mainActionDescription}>
                                Ask the horse owner for the 6-digit OTP sent to their phone.
                            </AppText>

                            {/* Success Send Banner Alert */}
                            {otpSentSuccess && (
                                <View style={styles.successBanner}>
                                    <Check size={14} color={COLORS.greenSuccess} />
                                    <AppText style={styles.successBannerText}>OTP sent to customer successfully</AppText>
                                </View>
                            )}

                            {/* 6 Digit Box Slots */}
                            <View style={styles.otpGridContainer}>
                                {Array(6).fill('').map((_, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => (otpInputsRef.current[index] = ref)}
                                        style={styles.otpInputBox}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={otp[index]}
                                        onChangeText={(text) => handleOtpInput(text, index)}
                                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                        selectTextOnFocus
                                        textAlign="center"
                                    />
                                ))}
                            </View>
                            <AppText style={styles.otpLabelDigits}>0/6 digits</AppText>

                            {/* Resend Action Trigger */}
                            <TouchableOpacity activeOpacity={0.7} onPress={handleSendOtp}>
                                <AppText style={styles.resendTextLink}>Didn't receive? Resend OTP</AppText>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* STEP 3: Complete View */}
                    {step === 3 && (
                        <View style={styles.centerSection}>
                            <View style={[styles.middleIconBox, { backgroundColor: COLORS.greenLightBg, borderColor: COLORS.greenBorder }]}>
                                <CheckCircle2 size={32} color={COLORS.greenActive} />
                            </View>
                            <AppText style={styles.mainActionHeading}>Verified successfully</AppText>
                            <AppText style={styles.mainActionDescription}>
                                The delivery PIN has been validated. You are now cleared to mark this shipment route as complete.
                            </AppText>
                        </View>
                    )}

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
                                    <Send size={18} color={COLORS.white} style={styles.actionBtnIcon} />
                                    <AppText style={styles.actionBtnText}>Send OTP to Customer</AppText>
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
                                    <Check size={18} color={COLORS.white} style={styles.actionBtnIcon} />
                                    <AppText style={styles.actionBtnText}>Verify OTP</AppText>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    {step === 3 && (
                        <TouchableOpacity
                            style={[styles.goldActionButton, { backgroundColor: COLORS.greenSuccess }]}
                            onPress={handleDone}
                            activeOpacity={0.8}
                        >
                            <Check size={18} color={COLORS.white} style={styles.actionBtnIcon} />
                            <AppText style={styles.actionBtnText}>Complete Manifest</AppText>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Alert Dialog confirmation slot */}
                <ConfirmationModal
                    isVisible={modalConfig.isVisible}
                    onClose={() => setModalConfig((prev) => ({ ...prev, isVisible: false }))}
                    onConfirm={() => setModalConfig((prev) => ({ ...prev, isVisible: false }))}
                    title={modalConfig.title}
                    description={modalConfig.description}
                    type={modalConfig.type}
                    confirmText="Got It"
                    cancelText="Close"
                />
            </KeyboardAvoidingView>
        </View>
    );
};

export default DeliveryVerificationScreen;

