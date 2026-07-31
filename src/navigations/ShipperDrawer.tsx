import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ShipperTabs from './ShipperTabs';
import CustomShipperDrawerContent from './CustomShipperDrawerContent';

// Additional Drawer Screens
import MyVehiclesScreen from '../role/shipper/screens/vehicles/MyVehiclesScreen';
import TruckDriverScreen from '../role/shipper/screens/drivers/TruckDriverScreen';
import EarningsScreen from '../role/shipper/screens/earnings/EarningsScreen';
import ShipperSettingsScreen from '../role/shipper/screens/settings/ShipperSettingsScreen';
import GoogleReviewScreen from '../role/shipper/screens/reviews/GoogleReviewScreen';
import PrivacyPolicyScreen from '../role/shipper/screens/privacy/PrivacyPolicyScreen';
import PreferredAreasScreen from '../role/shipper/screens/preferredareas/PreferredAreasScreen';

const Drawer = createDrawerNavigator();

const ShipperDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomShipperDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={ShipperTabs}
        options={{ drawerLabel: 'Home' }}
      />
      <Drawer.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <Drawer.Screen name="TruckDriver" component={TruckDriverScreen} />
      <Drawer.Screen name="Earnings" component={EarningsScreen} />
      <Drawer.Screen name="GoogleReview" component={GoogleReviewScreen} />
      <Drawer.Screen name="Settings" component={ShipperSettingsScreen} />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Drawer.Screen name="PreferredAreas" component={PreferredAreasScreen} />
    </Drawer.Navigator>
  );
};


export default ShipperDrawer;
