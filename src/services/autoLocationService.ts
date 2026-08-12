// src/services/autoLocationService.ts
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import driverService from '../api/services/driverService';

const AUTO_TRACKING_KEY = '@horse_shipt_auto_tracking_active';

let watchId: number | null = null;
let timerId: ReturnType<typeof setInterval> | null = null;
let isTrackingActive = false;

const syncLocationNow = () => {
  Geolocation.getCurrentPosition(
    async position => {
      try {
        if (position?.coords) {
          const { latitude, longitude, speed, heading } = position.coords;
          await driverService.updateLocation({
            lat: latitude,
            lng: longitude,
            speed: speed ?? 0,
            heading: heading ?? 0,
          });
          console.log('[AutoLocationService] Live location synced:', latitude, longitude);
        }
      } catch (err) {
        console.warn('[AutoLocationService] Location API update error:', err);
      }
    },
    error => {
      console.warn('[AutoLocationService] GPS lock error:', error?.message || error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    }
  );
};

export const startAutoTracking = async (): Promise<boolean> => {
  try {
    if (isTrackingActive) return true;

    isTrackingActive = true;
    await AsyncStorage.setItem(AUTO_TRACKING_KEY, 'true');

    // Immediate sync on start
    syncLocationNow();

    // Set up continuous watch
    watchId = Geolocation.watchPosition(
      async position => {
        try {
          if (position?.coords) {
            const { latitude, longitude, speed, heading } = position.coords;
            await driverService.updateLocation({
              lat: latitude,
              lng: longitude,
              speed: speed ?? 0,
              heading: heading ?? 0,
            });
            console.log('[AutoLocationService] Watch location synced:', latitude, longitude);
          }
        } catch (err) {
          console.warn('[AutoLocationService] Watch update error:', err);
        }
      },
      error => {
        console.warn('[AutoLocationService] Watch error:', error?.message || error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 10000,
        fastestInterval: 5000,
        showsBackgroundLocationIndicator: true,
      }
    );

    // Fallback interval sync every 10 seconds
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      if (isTrackingActive) {
        syncLocationNow();
      }
    }, 10000);

    return true;
  } catch (error) {
    console.error('[AutoLocationService] Error starting tracking:', error);
    return false;
  }
};

export const stopAutoTracking = async (): Promise<boolean> => {
  try {
    isTrackingActive = false;
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    await AsyncStorage.setItem(AUTO_TRACKING_KEY, 'false');
    return false;
  } catch (error) {
    console.error('[AutoLocationService] Error stopping tracking:', error);
    return false;
  }
};

export const isAutoTrackingActive = (): boolean => {
  return isTrackingActive;
};

export const getStoredAutoTrackingState = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(AUTO_TRACKING_KEY);
    return val === 'true';
  } catch {
    return false;
  }
};
