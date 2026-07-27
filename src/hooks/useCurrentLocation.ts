import { useState, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { LocationCoords } from '../components/common/LocationPicker/types';
 
export const useCurrentLocation = () => {
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getCurrentPosition = (): Promise<LocationCoords> => {
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
  };

  return { getCurrentPosition, requestPermission, loading };
};
