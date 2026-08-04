// src/services/autoLocationService.ts
import BackgroundService from 'react-native-background-actions';
import { AppState } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import driverService from '../api/services/driverService';

const AUTO_TRACKING_KEY = '@horse_shipt_auto_tracking_active';

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(resolve, time));

/**
 * Background loop executed by BackgroundService (Android Foreground Service & iOS background runner).
 * Periodically gets current GPS coordinates and sends location update API request.
 * - Foreground ('active'): every 5 seconds (5000 ms)
 * - Background/Killed (not 'active'): every 10 seconds (10000 ms)
 */
const autoLocationTask = async (taskDataArguments?: any) => {
  console.log('[AutoLocationService] Background tracking task initiated');

  while (BackgroundService.isRunning()) {
    const isForeground = AppState.currentState === 'active';
    const intervalMs = isForeground ? 5000 : 10000;

    await new Promise<void>(resolve => {
      Geolocation.getCurrentPosition(
        async position => {
          try {
            const { latitude, longitude, speed, heading } = position.coords;
            await driverService.updateLocation({
              lat: latitude,
              lng: longitude,
              speed: speed ?? 0,
              heading: heading ?? 0,
            });
          } catch (err) {
            console.warn('[AutoLocationService] Location API update error:', err);
          } finally {
            resolve();
          }
        },
        error => {
          console.warn('[AutoLocationService] GPS lock error:', error.message);
          resolve();
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 3000,
        }
      );
    });

    await sleep(intervalMs);
  }

  console.log('[AutoLocationService] Background tracking task stopped');
};

const options = {
  taskName: 'HorseShiptAutoTrackService',
  taskTitle: 'Horse Shipt Live Tracking',
  taskDesc: 'Auto-tracking driver position (5s active / 10s background)',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#A06333',
  linkingURI: 'horseshipt://location',
  parameters: {
    delay: 5000,
  },
};

export const startAutoTracking = async (): Promise<boolean> => {
  try {
    if (!BackgroundService.isRunning()) {
      await BackgroundService.start(autoLocationTask, options);
    }
    await AsyncStorage.setItem(AUTO_TRACKING_KEY, 'true');
    return true;
  } catch (error) {
    console.error('[AutoLocationService] Error starting service:', error);
    return false;
  }
};

export const stopAutoTracking = async (): Promise<boolean> => {
  try {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
    await AsyncStorage.setItem(AUTO_TRACKING_KEY, 'false');
    return false;
  } catch (error) {
    console.error('[AutoLocationService] Error stopping service:', error);
    return false;
  }
};

export const isAutoTrackingActive = (): boolean => {
  return BackgroundService.isRunning();
};

export const getStoredAutoTrackingState = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(AUTO_TRACKING_KEY);
    return val === 'true';
  } catch {
    return false;
  }
};
