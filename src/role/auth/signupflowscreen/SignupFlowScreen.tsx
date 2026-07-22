import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { CheckCircle2, Circle, ChevronLeft } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constants';
import { AppText, Input } from '../../../components';
import AppButton from '../../../components/common/Button/AppButton';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './styles.signupflow';
import authService from '../../../api/services/authService';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../redux/slices/authSlice';
import Toast from 'react-native-toast-message';

const SignupFlowScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  // UI State
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);  

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Error States
  const [errors, setErrors] = useState({ email: '', otp: '', name: '' });

  const otpInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
    return () => { showSubscription.remove(); hideSubscription.remove(); };
  }, []);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasLength && hasNumber && hasSymbol;

  const getPasswordScore = () => [hasLength, hasNumber, hasSymbol].filter(Boolean).length;
  const barWidth = getPasswordScore() === 0 ? '0%' : getPasswordScore() === 1 ? '33%' : getPasswordScore() === 2 ? '66%' : '100%';
  const barColor = getPasswordScore() === 3 ? COLORS.success : getPasswordScore() === 2 ? COLORS.warning : COLORS.error;

  // --- API HANDLERS ---

  const handleInitialSignup = async () => {
    if (!name.trim()) return setErrors(p => ({ ...p, name: 'Name is required' }));
    if (!emailRegex.test(email)) return setErrors(p => ({ ...p, email: 'Invalid email' }));
    if (!isPasswordValid) return;

    try {
      setIsLoading(true);
      const res = await authService.signup({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        role: 'customer'
      });

      if (res.success) {
        setStep(2);
        setResendTimer(60);
        Toast.show({ type: 'success', text1: 'OTP Sent', text2: 'Please check your email' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Signup failed';
      setErrors(p => ({ ...p, email: msg }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (val?: string) => {
    const code = val || otp;
    if (code.length !== 6) return;

    try {
      setIsLoading(true);
      // 1. Clear previous OTP errors
      setErrors(p => ({ ...p, otp: '' }));

      const result = await authService.verifySignupOtp({
        email: email.toLowerCase().trim(),
        role: 'customer',
        otp: code
      });

      // 2. Log result for debugging
      console.log("OTP Verification Result:", result);

      if (result && result.token) {
        // 3. Update Redux State
        dispatch(setCredentials(result));
        // 4. Move to Success Step
        setStep(3);
      } else {
        throw new Error("Invalid response structure");
      }

    } catch (err: any) {
      console.log("Verify Error:", err);
      // ONLY set error if the API actually failed
      const msg = err?.response?.data?.message || 'Invalid or expired OTP';
      setErrors(p => ({ ...p, otp: msg }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await authService.forgotPassword(email, 'customer');
      setResendTimer(60);
      Toast.show({ type: 'success', text1: 'OTP Resent' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Resend Failed' });
    }
  };

  // --- RENDER HELPERS ---

  const renderStepper = (current: number) => (
    <View style={styles.stepperContainer}>
      {[1, 2].map((item) => (
        <View key={item} style={[styles.stepLine, { width: 40, backgroundColor: item <= current ? COLORS.goldPrimary : COLORS.grey200 }]} />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={imageIndex.HorseBg}
        style={[styles.backgroundImage, { height: isKeyboardOpen ? SCREEN_HEIGHT * 0.20 : SCREEN_HEIGHT * 0.45 }]}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        {step < 3 && (
          <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(1)} style={styles.backBtn}>
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
        )}
      </ImageBackground>

      <KeyboardAvoidingView style={styles.cardContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contentCard}>



          <Image source={imageIndex.Logo} style={styles.logoIcon} resizeMode="contain" />


          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

            {/* STEP 1: INFORMATION */}
            {step === 1 && (
              <View style={styles.formContainer}>
                <AppText style={styles.title}>Create Account 1/2</AppText>
                {renderStepper(1)}

                <Input label="Full Name" placeholder="John Doe" value={name} onChangeText={(t) => { setName(t); setErrors(p => ({ ...p, name: '' })); }} error={errors.name} />
                <Input label="Email Address" placeholder="john@example.com" value={email} onChangeText={(t) => { setEmail(t); setErrors(p => ({ ...p, email: '' })); }} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
                <Input label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} isPassword={true} />

                <View style={styles.meterTrack}><View style={[styles.meterFill, { width: barWidth as any, backgroundColor: barColor }]} /></View>
                <View style={styles.checklist}>
                  <CheckListItem status={hasLength} label="8 characters minimum" />
                  <CheckListItem status={hasNumber} label="A number" />
                  <CheckListItem status={hasSymbol} label="A symbol" />
                </View>

                <AppButton title="Continue" onPress={handleInitialSignup} isLoading={isLoading} disabled={!name || !email || !isPasswordValid} buttonStyle={styles.actionBtn} />
              </View>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <View style={styles.formContainer}>
                <AppText style={styles.title}>Verify Email 2/2</AppText>
                {renderStepper(2)}
                <AppText style={[styles.subtitle, { textAlign: 'center' }]}>
                  We sent a 6-digit code to{" "}
                  <AppText style={{ fontFamily: FONTS.bold, color: COLORS.textPrimary }}>
                    {email}
                  </AppText>
                </AppText>
                <TouchableOpacity activeOpacity={1} style={styles.otpWrapper} onPress={() => otpInputRef.current?.focus()}>
                  <TextInput ref={otpInputRef} value={otp} onChangeText={(t) => { setOtp(t); if (t.length === 6) handleOtpVerify(t); }} maxLength={6} keyboardType="number-pad" style={styles.hiddenOtpInput} autoFocus />
                  <View style={styles.otpBoxContainer}>
                    {Array(6).fill(0).map((_, idx) => (
                      <View key={idx} style={[styles.otpBox, otp.length === idx && styles.otpBoxFocused, otp[idx] && styles.otpBoxFilled]}>
                        <AppText style={styles.otpText}>{otp[idx] || ''}</AppText>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
                {errors.otp ? <AppText style={styles.errorText}>{errors.otp}</AppText> : null}

                <View style={styles.resendRow}>
                  <AppText style={styles.resendText}>Didn't receive code?</AppText>
                  <TouchableOpacity onPress={handleResendOtp} disabled={resendTimer > 0}>
                    <AppText style={[styles.resendLink, resendTimer > 0 && { color: COLORS.grey400 }]}>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                    </AppText>
                  </TouchableOpacity>
                </View>

                <AppButton title="Verify & Create Account" onPress={() => handleOtpVerify()} isLoading={isLoading} disabled={otp.length !== 6} buttonStyle={styles.actionBtn} />
              </View>
            )}

            {/* STEP 3: SUCCESS (RESTORED COMPLETELY) */}
            {step === 3 && (
              <View style={styles.formContainer}>
                <View style={styles.successIconWrapper}>
                  <Image source={imageIndex.HorseIcon} style={styles.successIcon} resizeMode="contain" />
                </View>
                <AppText style={styles.successTitle}>Your account{"\n"}was successfully created!</AppText>
                <AppText style={styles.successSub}>One tap to book your next horse shipment.</AppText>
                <AppButton
                  title="Login"
                  onPress={() => navigation.navigate('Main')}
                  buttonStyle={styles.actionBtn}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const CheckListItem = ({ status, label }: { status: boolean, label: string }) => (
  <View style={styles.checkItem}>
    {status ? <CheckCircle2 size={14} color={COLORS.success} /> : <Circle size={14} color={COLORS.grey300} />}
    <AppText style={[styles.checkText, status && { color: COLORS.textPrimary }]}>{label}</AppText>
  </View>
);

export default SignupFlowScreen;