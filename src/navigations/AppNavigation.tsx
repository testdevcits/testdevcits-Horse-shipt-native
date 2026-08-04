

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks/redux';
import { View, ActivityIndicator } from 'react-native';

// Screens & Navigators
import Splash from '../role/auth/splash/Splash';
import WelcomeScreen from '../role/auth/welcome/Welcome';
import RoleSelection from '../role/auth/roleselection/RoleSelection';
import RegisterScreen from '../role/auth/register/RegisterScreen';
import Login from '../role/auth/login/Login';
import SignupFlowScreen from '../role/auth/signupflowscreen/SignupFlowScreen';
import DriverNavigator from './DriverNavigator';
import ShipperNavigation from './ShipperNavigation';
import CustomerNavigation from './CustomerNavigation';
import PasswordRecovery from '../role/auth/passwordrecovery/PasswordRecovery';
import ResetPassword from '../role/auth/resetpassword/ResetPassword';
import VerifyOtp from '../role/auth/verifyotp/VerifyOtp';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  RoleSelection: undefined;
  Login: undefined;
  DriverNavigator: undefined;
  ShipperNavigation: undefined;
  CustomerNavigation: undefined;
  Register: undefined;
  SignupFlowScreen: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  VerifyOtp: { email: string };

  // ... add others
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const { user, token, isLoading } = useAppSelector(state => state.auth);

  // Initial session rehydration loading
  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          // AUTH FLOW
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelection} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="SignupFlowScreen"
              component={SignupFlowScreen}
            />
            <Stack.Screen name="ForgotPassword" component={PasswordRecovery} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
          </>
        ) : (
          // APP FLOW
          <>
            {user?.role === 'driver' && (
              <Stack.Screen
                name="DriverNavigator"
                component={DriverNavigator}
              />
            )}
            {user?.role === 'shipper' && (
              <Stack.Screen
                name="ShipperNavigation"
                component={ShipperNavigation}
              />
            )}
            {(user?.role === 'customer' || !user?.role) && (
              <Stack.Screen
                name="CustomerNavigation"
                component={CustomerNavigation}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
