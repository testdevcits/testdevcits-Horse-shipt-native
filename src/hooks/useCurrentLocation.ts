import { useCallback, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { LocationCoords } from '../components/common/LocationPicker/types';

export const useCurrentLocation = () => {
  const [loading, setLoading] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      try {
        const whenInUse = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (whenInUse === RESULTS.GRANTED || whenInUse === RESULTS.LIMITED) {
          return true;
        }
        const always = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (always === RESULTS.GRANTED) {
          return true;
        }
        if (whenInUse === RESULTS.DENIED) {
          const res = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          return res === RESULTS.GRANTED || res === RESULTS.LIMITED;
        }
        return false;
      } catch {
        return false;
      }
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }, []);

  const getCurrentPosition = useCallback((): Promise<LocationCoords> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      Geolocation.getCurrentPosition(
        pos => {
          setLoading(false);
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        error => {
          setLoading(false);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  }, []);

  return { getCurrentPosition, requestPermission, loading };
};
