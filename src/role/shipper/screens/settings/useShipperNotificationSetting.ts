import { useEffect, useState } from 'react';
import shipperService from '../../../../api/services/shipperService';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';

const NOTIFICATION_ITEMS = [
  {
    key: 'quote',
    title: 'Quote won',
    desc: 'Get notified when you win a quote?.',
  },
  {
    key: 'opportunity',
    title: 'New Opportunity',
    desc: 'When a new opportunity in your area is published.',
  },
  {
    key: 'message',
    title: 'New message',
    desc: 'When you receive a new message from a carrier or shipper.',
  },
  {
    key: 'question',
    title: 'Shipment questions',
    desc: 'When a customer answers your shipment question.',
  },
  {
    key: 'review',
    title: 'Review received',
    desc: 'When a customer leaves a review.',
  },
  {
    key: 'shipment',
    title: 'Upcoming shipment',
    desc: 'Reminders before a scheduled shipment departure.',
  },
];

const useShipperNotificationSetting = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [notifications, setNotifications] = useState<any>({
    quote: { email: true, sms: true },
    opportunity: { email: true, sms: true },
    message: { email: true, sms: true },
    question: { email: true, sms: true },
    review: { email: true, sms: true },
    shipment: { email: true, sms: true },
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await shipperService.getSettings();
      if (res?.data?.notifications) {
        setNotifications(res?.data?.notifications);
      }
    } catch (error: any) {
      console.error('Fetch Shipper Settings Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSettings();
  };

  const handleToggleNotification = async (
    key: string,
    channel: 'email' | 'sms',
  ) => {
    const currentVal = notifications[key]?.[channel] ?? true;
    const updated = {
      ...notifications,
      [key]: {
        ...notifications[key],
        [channel]: !currentVal,
      },
    };

    setNotifications(updated);

    try {
      const res = await shipperService.updateNotifications(updated);
      if (res?.success) {
        showSuccessToast(
          'Settings Updated',
          'Notification preferences saved successfully.',
        );
      }
    } catch (error: any) {
      console.error('Update Notifications Error:', error);
      // Revert on error
      setNotifications(notifications);

      showErrorToast(
        'Update Failed',
        error?.response?.data?.message ||
          'Failed to update notification settings.',
      );
    }
  };

  return {
    NOTIFICATION_ITEMS,
    loading,
    refreshing,
    onRefresh,
    handleToggleNotification,
    notifications,
  };
};

export default useShipperNotificationSetting;
