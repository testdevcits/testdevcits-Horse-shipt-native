import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,

} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';
import { AppText, Input } from '../../../components';
import Ionicons from "@react-native-vector-icons/ionicons"
import AppButton from '../../../components/common/Button/AppButton';
import styles from './styles';


// Validation Schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().required('Please select a role'),
});

const Signup = ({ navigation }: any) => {
  const handleSignup = (values: any) => {
    console.log('Signup Values:', values);
    // Integrate your API call here
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <AppText style={styles.title}>Create Account</AppText>
            <View style={styles.loginRow}>
              <AppText style={styles.subtitle}>Already have an account? </AppText>
              <TouchableOpacity onPress={() => navigation?.goBack()}>
                <AppText style={styles.loginLink}>Login</AppText>
              </TouchableOpacity>
            </View>
          </View>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: 'customer', // Default role
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
              <View style={styles.form}>


                {/* Role Selection - Professional Card Style */}
                <AppText style={styles.label}>Select your role</AppText>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleCard,
                      values.role === 'shipper' && styles.activeRoleCard,
                    ]}
                    onPress={() => setFieldValue('role', 'shipper')}
                  >
                    <Ionicons
                      name="bus-outline"
                      size={24}
                      color={values.role === 'shipper' ? COLORS.primary : COLORS.grey400}
                    />
                    <AppText style={[styles.roleText, values.role === 'shipper' && styles.activeRoleText]}>
                      Shipper
                    </AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleCard,
                      values.role === 'customer' && styles.activeRoleCard,
                    ]}
                    onPress={() => setFieldValue('role', 'customer')}
                  >
                    <Ionicons
                      name="person-outline"
                      size={24}
                      color={values.role === 'customer' ? COLORS.primary : COLORS.grey400}
                    />
                    <AppText style={[styles.roleText, values.role === 'customer' && styles.activeRoleText]}>
                      Customer
                    </AppText>
                  </TouchableOpacity>
                </View>
                {touched.role && errors.role && (
                  <AppText style={styles.errorText}>{errors.role}</AppText>
                )}

                <Input
                  label="Name"
                  placeholder="John Doe"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  error={touched.name ? errors.name : ''}
                />

                <Input
                  label="Email"
                  placeholder="example@mail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  error={touched.email ? errors.email : ''}
                />

                <Input
                  label="Password"
                  placeholder="••••••••"
                  isPassword
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  error={touched.password ? errors.password : ''}
                  rightIcon={<Ionicons name="eye-outline" size={20} color={COLORS.grey400} />}
                />

                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  isPassword
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                  rightIcon={<Ionicons name="eye-outline" size={20} color={COLORS.grey400} />}
                />


                <AppButton
                  title="Signup"
                  onPress={() => handleSubmit()}
                  buttonStyle={styles.signupButton}

                />

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <AppText style={styles.dividerText}>Or continue with</AppText>
                  <View style={styles.divider} />
                </View>

                {/* <TouchableOpacity style={styles.googleButton}>
                  <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                    style={styles.googleIcon}
                  />
                  <AppText style={styles.googleButtonText}>Continue with Google</AppText>
                </TouchableOpacity> */}

              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};



export default Signup;