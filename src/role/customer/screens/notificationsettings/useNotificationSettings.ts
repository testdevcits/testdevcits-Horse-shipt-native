import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import customerService from '../../../../api/services/customerService';

export const useNotificationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    newQuote: true,
    offerInteraction: true,
    newMessage: true,
    question: true,
    newReview: true,
    upcomingShipment: true,
    shipmentUpdates: true,
  });

  useEffect(() => {
    // Fetch initial settings from server
    const init = async () => {
      try {
        const res = await customerService.getNotificationSettings();
        if (res.success) setSettings(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const toggleSetting = async (key: string) => {
    const newValue = !settings[key as keyof typeof settings];

    // 1. Optimistic Update (Immediate UI feedback)
    setSettings(prev => ({ ...prev, [key]: newValue }));

    try {
      const res = await customerService.updateNotificationSetting(
        key,
        newValue,
      );
      if (res.success) {
        // Toast.show({
        //   type: 'success',
        //   text1: 'Preferences Updated',
        //   position: 'top',
        // });
      }
    } catch (error) {
      // 2. Rollback on failure
      setSettings(prev => ({ ...prev, [key]: !newValue }));
      // Toast.show({
      //   type: 'error',
      //   text1: 'Update Failed',
      //   text2: 'Please try again later',
      // });
    }
  };

  return { settings, loading, toggleSetting };
};
