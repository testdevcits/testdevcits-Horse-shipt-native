import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';

// Register background FCM message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('FCM Message handled in background:', remoteMessage);

  try {
    const channelId = await notifee.createChannel({
      id: 'default_horseshipt_channel',
      name: 'HorseShipt Alerts',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });

    const title =
      remoteMessage?.notification?.title ||
      remoteMessage?.data?.title ||
      'HorseShipt Alert';
    const body =
      remoteMessage?.notification?.body ||
      remoteMessage?.data?.body ||
      'New activity on your account.';

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
      data: remoteMessage?.data,
    });
  } catch (err) {
    console.error('Background notification display error:', err);
  }
});

// Register background Notifee event handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('User pressed background notification:', detail.notification);
  }
});

AppRegistry.registerComponent(appName, () => App);
