// import React, { useState } from 'react';
// import {
//   View,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { useNavigation, CommonActions } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
// import { COLORS, FONTS } from '../../../constants';
// import AppText from '../../../components/common/AppText';
// import { Input } from '../../../components';
// import styles from './styles.login';
// import authService from '../../../api/services/authService';
// import AppButton from '../../../components/common/Button/AppButton';
// import { useAppDispatch } from '../../../hooks/redux';
// import { UserRole } from '../../../types/auth';
// import { loginUser } from '../../../redux/slices/authSlice';

// // Import the auth service

// const Login = () => {
//   const navigation = useNavigation<any>();

//   // State Management
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   // 2. Inside your Login Component
//   const dispatch = useAppDispatch();
//   const [selectedRole, setSelectedRole] = useState<UserRole>('customer'); // Get this from your UI toggle

//   // Validation Errors
//   const [errors, setErrors] = useState({ email: '', password: '' });

//   // Input Field handlers to clear errors on change
//   const handleEmailChange = (text: string) => {
//     setEmail(text);
//     if (errors.email) {
//       setErrors((prev) => ({ ...prev, email: '' }));
//     }
//   };

//   const handlePasswordChange = (text: string) => {
//     setPassword(text);
//     if (errors.password) {
//       setErrors((prev) => ({ ...prev, password: '' }));
//     }
//   };

//   // Basic Validation Logic
//   const validateForm = () => {
//     let isValid = true;
//     let newErrors = { email: '', password: '' };

//     // Email validation
//     if (!email.trim()) {
//       newErrors.email = 'Email address is required';
//       isValid = false;
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email.trim())) {
//         newErrors.email = 'Please enter a valid email address';
//         isValid = false;
//       }
//     }

//     // Password validation
//     if (!password) {
//       newErrors.password = 'Password is required';
//       isValid = false;
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };



//   const handleSignIn = async () => {
//   if (!validateForm()) return;

//   setIsLoading(true);

//   // We wrap the dispatch in a 'unwrap' to catch errors in the local catch block
//   try {
//     const resultAction = await dispatch(
//       loginUser({
//         credentials: {
//           email: email.trim().toLowerCase(),
//           password: password,
//           role:selectedRole
//         },
//         role: selectedRole, // Important: Tell the thunk which role to log in as
//       })
//     ).unwrap();

//     // SUCCESS: 
//     // You don't need navigation.reset() here! 
//     // AppNavigation.tsx will see the token in Redux and show the correct Home screen.
//     console.log('Login successful:', resultAction.user.name);

//   } catch (err: any) {
//     // ERROR:
//     // The 'unwrap' sends the error message here automatically
//     Alert.alert('Authentication Error', err || 'Invalid credentials');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <View style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header Block */}
//           <View style={styles.headerContainer}>
//             <View style={styles.badge}>
//               <ShieldCheck size={16} color={COLORS.secondary} />
//               <AppText style={styles.badgeText}>SECURE GATEWAY</AppText>
//             </View>
//             <AppText style={styles.welcomeText}>Welcome back</AppText>
//             <AppText style={styles.descriptionText}>
//               Sign in to manage routes, track deliveries, and update dispatch.
//             </AppText>
//           </View>

//           {/* Form Block */}
//           <View style={styles.formContainer}>
//             {/* Email Input */}
//             <Input
//               label="Email Address"
//               placeholder="driver@fleetrun.com"
//               value={email}
//               onChangeText={handleEmailChange}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//               error={errors.email}
//               disabled={isLoading}
//               leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
//             />

//             {/* Password Input */}
//             <Input
//               label="Password"
//               placeholder="••••••••"
//               value={password}
//               onChangeText={handlePasswordChange}
//               isPassword={true}
//               error={errors.password}
//               disabled={isLoading}
//               leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
//               rightIcon={
//                 isPasswordVisible ? (
//                   <EyeOff size={20} color={COLORS.textSecondary} />
//                 ) : (
//                   <Eye size={20} color={COLORS.textSecondary} />
//                 )
//               }
//               onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
//             />

//             {/* Forgot Password Button */}
//             <TouchableOpacity
//               activeOpacity={0.7}
//               style={styles.forgotPasswordContainer}
//               onPress={() => Alert.alert('Reset Password', 'Contact dispatch or your fleet administrator to reset security credentials.')}
//             >
//               <AppText style={styles.forgotPasswordText}>Forgot Password?</AppText>
//             </TouchableOpacity>

//             {/* Submit Action Button */}
//             <AppButton
//               title="Sign In to Portal"
//               isLoading={isLoading}
//               onPress={handleSignIn}
//               buttonStyle={styles.signInButton}
//             />
//           </View>

//           {/* Dispatch Notice / Support Footer */}
//           <View style={styles.footerContainer}>
//             <AppText style={styles.footerTitle}>New to Horse Shipt?</AppText>
//             <AppText style={styles.footerSubtitle}>
//               Driver profiles are created by dispatch. Contact your operations office to activate your login.
//             </AppText>
//           </View>

//           <View style={styles.signupfooterContainer}>
//             <AppText style={styles.footerText}>Don't have an account? </AppText>
//             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//               <AppText style={styles.footerLink}>Create an account</AppText>
//             </TouchableOpacity>
//           </View>

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react'; // 1. Added useEffect
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  StatusBar,
  Keyboard, // 2. Added Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react-native';
import { COLORS, RADIUS, SCREEN_HEIGHT } from '../../../constants';
import AppText from '../../../components/common/AppText';
import { Input } from '../../../components';
import AppButton from '../../../components/common/Button/AppButton';
import { useAppDispatch } from '../../../hooks/redux';
import { loginUser } from '../../../redux/slices/authSlice';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './styles.login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  // State Management
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 3. Keyboard state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  // 4. Keyboard Listeners Logic
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const userRole = await AsyncStorage.getItem("@user_role")
      await dispatch(loginUser({ credentials: { email: email.trim().toLowerCase(), password, role: userRole }, role: userRole })).unwrap();
    } catch (err: any) {
      Alert.alert('Authentication Error', err || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 5. Dynamic Header Image Height (Calculates 15% when keyboard open) */}
      <ImageBackground
        source={imageIndex.HorseBg}
        style={[
          styles.headerImage,
          { height: isKeyboardOpen ? SCREEN_HEIGHT * 0.20 : SCREEN_HEIGHT * 0.45 }
        ]}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* 6. This View will now occupy 80-85% of the screen when keyboard is open */}
        <View style={styles.contentCard}>
          {/*           
          <View style={styles.logoOuterRing}>
            <View style={styles.logoInnerRing}>
              <Image source={imageIndex.LogoIcon} style={styles.logoIcon} resizeMode="contain" />
            </View>
          </View> */}

          <Image source={imageIndex.Logo} style={styles.logoIcon} resizeMode="contain" />


          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textHeader}>
              <AppText style={styles.welcomeTitle}>Welcome Back</AppText>
              <AppText style={styles.subtitle}>
                Sign in to manage your shipments and track your horses in real time.
              </AppText>
            </View>

            <Input
              label="Email Address"
              placeholder="antestmail@123.com"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors(p => ({ ...p, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors(p => ({ ...p, password: '' })); }}
              isPassword={!isPasswordVisible}
              error={errors.password}
              leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
              rightIcon={
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                </TouchableOpacity>
              }
            />

            <View style={styles.utilRow}>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && (
                      <Check
                        size={14}
                        color={COLORS.white}
                        strokeWidth={3.5} // Thicker stroke for a "premium" bold look
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <AppText style={styles.utilText}>Remember me</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <AppText style={styles.forgotText}>Forgot Password?</AppText>
              </TouchableOpacity>
            </View>

            <AppButton title="Sign In" isLoading={isLoading} onPress={handleSignIn} buttonStyle={styles.signInBtn} />

            <View style={styles.footer}>
              <AppText style={styles.footerText}>Don't have an account? </AppText>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <AppText style={styles.footerLink}>Create an account</AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;