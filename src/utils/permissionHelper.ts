// src/utils/permissionHelper.ts
import { PermissionsAndroid, Platform, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

/**
 * Handles cross-platform location permissions, including settings fallback redirect
 * if permanently blocked by the driver.
 */
export const requestLocationPermission = async (
  onShowSettingsPrompt: (title: string, message: string) => void
): Promise<boolean> => {
  
  // --- iOS Handling ---
  if (Platform.OS === 'ios') {
    try {
      const status = await Geolocation.requestAuthorization('whenInUse');
      if (status === 'granted') {
        return true;
      }
      
      // If blocked, prompt settings redirect
      if (status === 'denied' || status === 'restricted') {
        onShowSettingsPrompt(
          'Location Services Required',
          'GPS access is restricted. Please open system settings and enable Location permissions manually to sync active route coordinates.'
        );
      }
      return false;
    } catch (error) {
      console.warn('iOS Permission request error:', error);
      return false;
    }
  }

  // --- Android Handling ---
  if (Platform.OS === 'android') {
    try {
      // 1. Check if permission was already granted previously
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (hasPermission) return true;

      // 2. Request system permission dialog
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Dispatch Location Sync',
          message: 'Horse Shipt needs access to your GPS coordinates to coordinate active shipment progress and arrival times.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      // 3. Fallback: User clicked "Don't ask again" (Permanently Blocked)
      if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        onShowSettingsPrompt(
          'GPS Access Blocked',
          'Location tracking access is permanently denied. Please open your system settings and grant location permissions manually to sync active runs.'
        );
      }
      return false;
    } catch (err) {
      console.warn('Android Permission request error:', err);
      return false;
    }
  }

  return false;
};

/**
 * Mandates foreground + background location permissions specifically required for Auto-Tracking.
 * Returns true ONLY if background location permission is granted.
 */
export const requestBackgroundLocationPermission = async (
  onShowSettingsPrompt: (title: string, message: string) => void
): Promise<boolean> => {
  // --- iOS Handling ---
  if (Platform.OS === 'ios') {
    try {
      const status = await Geolocation.requestAuthorization('always');
      if (status === 'granted') {
        return true;
      }

      onShowSettingsPrompt(
        'Background Location Mandate Required',
        'Auto-Tracking requires background location access ("Always Allow") to continuously sync your location during trips even when the app is closed or minimized. Please grant "Always" location access in system settings.'
      );
      return false;
    } catch (error) {
      console.warn('iOS Background permission request error:', error);
      return false;
    }
  }

  // --- Android Handling ---
  if (Platform.OS === 'android') {
    try {
      // 1. Check and request fine foreground location first
      const hasFineLocation = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (!hasFineLocation) {
        const fineStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Needed',
            message: 'Horse Shipt requires GPS location access for driver tracking.',
            buttonNeutral: 'Ask Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (fineStatus !== PermissionsAndroid.RESULTS.GRANTED) {
          onShowSettingsPrompt(
            'Foreground Location Required',
            'Foreground location access was denied. Background auto-tracking cannot function without location permission.'
          );
          return false;
        }
      }

      // 2. Notification permission check (Android 13+) for foreground service notification
      if (Platform.Version >= 33) {
        const hasNotif = await PermissionsAndroid.check(
          'android.permission.POST_NOTIFICATIONS' as any
        );
        if (!hasNotif) {
          await PermissionsAndroid.request(
            'android.permission.POST_NOTIFICATIONS' as any
          );
        }
      }

      // 3. Mandate Background Location permission (Android 10+ / API 29+)
      if (Platform.Version >= 29) {
        const hasBackgroundLocation = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );

        if (hasBackgroundLocation) {
          return true;
        }

        const bgStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Mandate',
            message:
              'Auto-Tracking mandates "Allow all the time" location access so dispatchers automatically receive updates every 10 seconds even when the app is in the background or closed.',
            buttonNeutral: 'Ask Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Grant Background Access',
          }
        );

        if (bgStatus === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }

        onShowSettingsPrompt(
          'Background Location Required',
          'Auto-Tracking mandates background location access ("Allow all the time"). Please open your system settings and set Location permission to "Allow all the time" to start Auto-Tracking.'
        );
        return false;
      }

      return true; // Android < 29 fine location covers background
    } catch (err) {
      console.warn('Android Background permission error:', err);
      return false;
    }
  }

  return false;
};

// Simple utility to open device native Settings screen
export const openDeviceSettings = async () => {
  try {
    await Linking.openSettings();
  } catch (err) {
    console.warn('Failed to open device system settings page:', err);
  }
};