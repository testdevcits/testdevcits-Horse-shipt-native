import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  EventType,
  Event,
} from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import customerService from '../api/services/customerService';
import { store } from '../app/store';

const FCM_TOKEN_STORAGE_KEY = '@fcm_token';
const DEFAULT_CHANNEL_ID = 'default_horseshipt_channel';

export const notificationService = {
  /**
   * Request Notification permissions (iOS and Android 13+)
   */
  requestPermission: async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Android 13+ POST_NOTIFICATIONS permission denied');
        }
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      await notifee.requestPermission();

      console.log('FCM Notification permission status:', authStatus);
      return enabled;
    } catch (error) {
      console.error('Request notification permission error:', error);
      return false;
    }
  },

  /**
   * Create Android Notification Channel
   */
  createChannel: async (): Promise<string> => {
    try {
      return await notifee.createChannel({
        id: DEFAULT_CHANNEL_ID,
        name: 'HorseShipt Alerts',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    } catch (error) {
      console.error('Create notification channel error:', error);
      return DEFAULT_CHANNEL_ID;
    }
  },

  /**
   * Get Current Device FCM Token
   */
  getFcmToken: async (): Promise<string | null> => {
    try {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        console.log('Device FCM Token:', token);
      }
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  },

  /**
   * Register FCM Token with API Backend
   */
  registerFcmTokenWithBackend: async (fcmToken?: string) => {
    try {
      const state = store.getState();
      const userRole =
        state?.auth?.user?.role || (await AsyncStorage.getItem('@user_role'));

      // Do NOT call customer subscription API if user is a shipper or driver
      if (userRole && userRole !== 'customer') {
        console.log(
          `Skipping customer notification subscription for role: ${userRole}`,
        );
        return;
      }

      const token = fcmToken || (await notificationService.getFcmToken());
      if (!token) return;

      // Attempt subscribing token to backend if customer endpoint available
      try {
        await customerService.subscribeNotifications({
          subscription: {
            endpoint: token,
            expirationTime: null,
            keys: {
              p256dh: token,
              auth: token,
            },
          },
        });
        console.log('FCM Token registered with backend successfully');
      } catch (apiErr) {
        // Log quietly if API endpoint doesn't accept FCM format
        console.log('Backend notification subscription status:', apiErr);
      }
    } catch (error) {
      console.error('Register FCM Token with backend error:', error);
    }
  },

  /**
   * Display Local Heads-up Notification
   */
  displayNotification: async (
    title: string,
    body: string,
    data?: Record<string, any>,
  ) => {
    try {
      const channelId = await notificationService.createChannel();
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        data,
      });
    } catch (error) {
      console.error('Display notification error:', error);
    }
  },

  /**
   * Initialize all notification listeners (Foreground, Background, Token Refresh)
   */
  init: async (onNotificationClick?: (data?: any) => void) => {
    try {
      // 1. Request permissions & create channel
      const hasPermission = await notificationService.requestPermission();
      if (!hasPermission) {
        console.log('Notification permission not granted.');
      }

      await notificationService.createChannel();

      // 2. Fetch FCM Token & register
      const token = await notificationService.getFcmToken();
      if (token) {
        notificationService.registerFcmTokenWithBackend(token);
      }

      // 3. Token Refresh Listener
      const unsubscribeTokenRefresh = messaging().onTokenRefresh(newToken => {
        console.log('FCM Token refreshed:', newToken);
        AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, newToken);
        notificationService.registerFcmTokenWithBackend(newToken);
      });

      // 4. Foreground Message Listener (App is active)
      const unsubscribeForeground = messaging().onMessage(
        async remoteMessage => {
          console.log('Foreground FCM Message received:', remoteMessage);

          const rawTitle =
            remoteMessage?.notification?.title ||
            remoteMessage?.data?.title ||
            'HorseShipt Update';
          const rawBody =
            remoteMessage?.notification?.body ||
            remoteMessage?.data?.body ||
            'You have a new update.';

          const title =
            typeof rawTitle === 'string' ? rawTitle : String(rawTitle);
          const body = typeof rawBody === 'string' ? rawBody : String(rawBody);

          await notificationService.displayNotification(
            title,
            body,
            remoteMessage?.data,
          );
        },
      );

      // 5. Notification Tap Listener when App is in Background
      const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
        remoteMessage => {
          console.log(
            'App opened from background notification:',
            remoteMessage,
          );
          if (onNotificationClick) {
            onNotificationClick(remoteMessage?.data);
          }
        },
      );

      // 6. Check Initial Notification if App was launched from Quit state
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'App opened from quit state notification:',
              remoteMessage,
            );
            if (onNotificationClick) {
              onNotificationClick(remoteMessage?.data);
            }
          }
        });

      // 7. Notifee Foreground Event Listener (Local notifications press)
      const unsubscribeNotifee = notifee.onForegroundEvent(
        ({ type, detail }: Event) => {
          if (type === EventType.PRESS) {
            console.log(
              'User pressed foreground notification:',
              detail.notification,
            );
            if (onNotificationClick) {
              onNotificationClick(detail.notification?.data);
            }
          }
        },
      );

      // Return cleanup function
      return () => {
        unsubscribeTokenRefresh();
        unsubscribeForeground();
        unsubscribeNotificationOpened();
        unsubscribeNotifee();
      };
    } catch (err) {
      console.error('Failed to initialize notificationService:', err);
      return () => {};
    }
  },
};
