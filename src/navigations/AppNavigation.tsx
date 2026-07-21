import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../role/auth/login/Login';
import Signup from '../role/auth/signup/Signup';
import { useSelector } from 'react-redux';
import DriverNavigator from './DriverNavigator';
import ShipperNavigation from './ShipperNavigation';
import CustomerNavigation from './CustomerNavigation';
import { useAppSelector } from '../hooks/redux';
import Splash from '../role/auth/splash/Splash';
import WelcomeScreen from '../role/auth/welcome/Welcome';
import RegisterScreen from '../role/auth/register/RegisterScreen';



// Define the type for all routes
export type RootStackParamList = {
    Splash: undefined;
    Welcome: undefined;
    Login: undefined;
    Signup: undefined;
    Register: undefined;
    // Tabs: undefined;
    // DeliveryVerification: undefined

    DriverNavigator: undefined;
    ShipperNavigation: undefined;
    CustomerNavigation: undefined

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
    const { user, token, isLoading } = useAppSelector((state: any) => state.auth);


    console.log("=============1====123456", user, token)



    if (isLoading) {
        return <Splash />;
    }


    return (
        <NavigationContainer>

            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!token ? (
                    // Public Screens
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Signup" component={Signup} />
                    </>
                ) : (
                    // Protected Role-Based Screens
                    <>
                        {user.role === 'driver' && <Stack.Screen name="DriverNavigator" component={DriverNavigator} />}
                        {user.role === 'shipper' && <Stack.Screen name="ShipperNavigation" component={ShipperNavigation} />}
                        {user.role === 'customer' && <Stack.Screen name="CustomerNavigation" component={CustomerNavigation} />}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation;

