import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import {Platform} from 'react-native';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    await notifee.requestPermission();
  }

  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  return enabled;
};



export const getFCMToken = async () => {
  const token = await messaging().getToken();

  console.log('FCM TOKEN:', token);

  return token;
};


export const listenToTokenRefresh = () => {
  return messaging().onTokenRefresh(token => {
    console.log('New FCM token:', token);

    // Send updated token to backend
  });
};

export const createNotificationChannel = async () => {
  if (Platform.OS !== 'android') {
    return;
  }

  await notifee.createChannel({
    id: 'default',
    name: 'Default Notifications',
    importance: AndroidImportance.HIGH,
  });
};

export const setupForegroundNotifications = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,

      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  });
};


export const setupNotificationOpenedApp = () => {
  return messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification opened:',
      remoteMessage,
    );

    // Navigate based on notification data
  });
};

export const checkInitialNotification = async () => {
  const remoteMessage =
    await messaging().getInitialNotification();

  if (remoteMessage) {
    console.log(
      'App opened from notification:',
      remoteMessage,
    );

    // Navigate to required screen
  }
};