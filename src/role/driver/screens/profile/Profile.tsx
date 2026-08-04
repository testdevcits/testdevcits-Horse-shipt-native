import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,

} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Phone, FileText, Box, LogOut } from 'lucide-react-native';

// Custom Design Systems
import { COLORS, FONTS } from '../../../../constants'; // Adjust relative path as needed
import AppText from '../../../../components/common/AppText';
import { useDriverMe } from '../../../../hooks/useDriverMe'; // Import our GET driver/me hook
import styles from './styles.profile';
import DriverHeader from '../../../../components/common/DriverHeader';
import { ConfirmationModal } from '../../../../components';
import { useAppDispatch } from '../../../../hooks/redux';
import { logoutUser } from '../../../../redux/slices/authSlice';

// Profile Theme Colors mapped to match the gold/beige screenshot details
const PROFILE_COLORS = {
  primary: COLORS.primary,
  goldPrimary: '#A37F3D',
  goldLightBg: '#FAF6EE',
  goldBorder: '#DCCEB2',
  goldDarkText: '#5C441E',
  greenPrimary: '#0F7643',
  greenLightBg: '#E6F7F0',
  greenBorder: '#A9E2CC',
  background: '#FAF8F5',
};

const Profile = () => {
  const navigation = useNavigation<any>();
  const { driver, allShipments, loading, refresh } = useDriverMe();
  const dispatch = useAppDispatch();

  // Extract completed shipments count
  const completedShipments = allShipments.filter(
    (shipment) => shipment?.tripStatus === 'delivered' || shipment.tripStatus === 'completed'
  );
  const completedCount = completedShipments.length;

  // State to control your custom confirmation modal
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // Execute the logout once confirmed in the modal
  // const handleLogoutConfirm = async () => {
  //   setIsLogoutModalVisible(false); // Close the modal
  //   try {
  //     // Clear token and profile from AsyncStorage
  //     await AsyncStorage.multiRemove(['userToken', 'driverProfile']);

  //     // Navigate to Login and clear history stack
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{ name: 'Login' }],
  //       })
  //     );
  //   } catch (error) {
  //     console.warn('Error during logout:', error);
  //   }
  // };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalVisible(false); // 1. Close UI Modal

    try {
      // 2. Dispatch the Thunk
      // This automatically clears AsyncStorage + Sets Redux User/Token to null
      await dispatch(logoutUser()).unwrap();

      // SUCCESS: 
      // You don't need navigation.reset()! 
      // AppNavigation.tsx (Root Navigator) will see that 'token' is now null 
      // and will automatically unmount the Tabs and mount the Login screen.

    } catch (error) {
      console.error('Manual logout failed:', error);
    }
  };


  if (loading && !driver) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PROFILE_COLORS.primary} />
      </View>
    );
  }

  // Fallback monogram if driver profile image does not exist
  const firstLetter = driver?.name ? driver.name.charAt(0).toUpperCase() : 'D';

  return (
    <View style={styles.safeArea}>
      {/* 1. Global Header Component rendered at the top of the screen */}
      <DriverHeader
        name={driver?.name || 'Test Driver'}
        statusText={driver?.driverStatus || 'ON TRIP'}
        profileImageUrl={driver?.profileImage?.url}
        isOnline={driver?.isActive !== false}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Header Card */}
        <View style={styles.mainCard}>
          {/* Avatar Area */}
          <View style={styles.avatarWrapper}>
            {driver?.profileImage?.url ? (
              <Image source={{ uri: driver.profileImage.url }} style={styles.avatarImage} />
            ) : (
              <View style={styles.monogramBox}>
                <AppText style={styles.monogramText}>{firstLetter}</AppText>
              </View>
            )}
          </View>

          {/* Driver Metadata */}
          <AppText style={styles.driverName}>{driver?.name || 'Test Driver'}</AppText>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <AppText style={styles.statusText}>
              {driver?.driverStatus ? driver.driverStatus.replace(/([A-Z])/g, ' $1').toUpperCase() : 'ON TRIP'}
            </AppText>
          </View>

          {/* Side-by-Side Statistics Block */}
          <View style={styles.statsRow}>
            {/* Completed stats box */}
            <View style={styles.completedBox}>
              <AppText style={styles.statLabel}>COMPLETED</AppText>
              <AppText style={styles.statValue}>{completedCount}</AppText>
            </View>

            {/* Account active stats box */}
            <View style={[
              styles.accountBox,
              driver?.isActive === false && styles.accountBoxInactive
            ]}>
              <AppText style={[
                styles.statLabel,
                { color: driver?.isActive === false ? COLORS.textSecondary : PROFILE_COLORS.greenPrimary }
              ]}>ACCOUNT</AppText>
              <AppText style={[
                styles.statValue,
                { color: driver?.isActive === false ? COLORS.textSecondary : PROFILE_COLORS.greenPrimary }
              ]}>
                {driver?.isActive !== false ? 'Active' : 'Inactive'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Personal Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <AppText style={styles.detailsHeaderTitle}>Personal Details</AppText>
          </View>
          <View style={styles.detailsBody}>
            {/* Email field */}
            <View style={styles.detailRow}>
              <Mail size={18} color={PROFILE_COLORS.primary} style={styles.detailIcon} />
              <View>
                <AppText style={styles.detailLabel}>EMAIL</AppText>
                <AppText style={styles.detailValue}>{driver?.email || 'testdevcits@gmail.com'}</AppText>
              </View>
            </View>

            {/* Phone field */}
            <View style={styles.detailRow}>
              <Phone size={18} color={PROFILE_COLORS.primary} style={styles.detailIcon} />
              <View>
                <AppText style={styles.detailLabel}>PHONE</AppText>
                <AppText style={styles.detailValue}>{driver?.phone || 'N/A'}</AppText>
              </View>
            </View>

            {/* License field */}
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <FileText size={18} color={PROFILE_COLORS.primary} style={styles.detailIcon} />
              <View>
                <AppText style={styles.detailLabel}>LICENSE</AppText>
                <AppText style={styles.detailValue}>{driver?.licenseNumber || 'N/A'}</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Completed Shipments Section */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <View style={styles.row}>
              <AppText style={styles.detailsHeaderTitle}>Completed Shipments</AppText>
              <View style={styles.completedBadgeCount}>
                <AppText style={styles.badgeCountText}>{completedCount}</AppText>
              </View>
            </View>
          </View>
          <View style={styles.shipmentsBody}>
            {completedCount === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBox}>
                  <Box size={24} color={PROFILE_COLORS.primary} />
                </View>
                <AppText style={styles.emptyText}>No completed shipments yet</AppText>
              </View>
            ) : (
              completedShipments.map((shipment, index) => (
                <View key={shipment._id} style={styles.completedShipmentRow}>
                  <Box size={18} color={PROFILE_COLORS.primary} />
                  <AppText style={styles.completedShipmentText}>
                    {shipment.shipment.pickupLocation} ➔ {shipment.shipment.deliveryLocation}
                  </AppText>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Action Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setIsLogoutModalVisible(!isLogoutModalVisible)}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={COLORS.white} style={styles.logoutIcon} />
          <AppText style={styles.logoutText}>Logout</AppText>
        </TouchableOpacity>

      </ScrollView>

      {/* 3. Integrated Confirmation Modal */}
      <ConfirmationModal
        isVisible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        description="Are you sure you want to log out of your driver session?"
        confirmText="Logout"
        cancelText="Cancel"
        type="danger" // Applies the red 'danger' layout styling from your stylesheet
      />
    </View>
  );
};

export default Profile;

