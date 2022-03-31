import PushNotification from 'react-native-push-notification';
//parts of this file is from: https://github.com/zo0r/react-native-push-notification

class Notifications {
  constructor() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'CO2warning', // (required)
        channelName: 'High CO2 levels warning', // (required)
        channelDescription: 'Reminder for any tasks', // (optional) default: undefined.
      },
      () => {}, // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  sendNotification() {
    PushNotification.localNotification({
      channelId: 'CO2warning',
      title: '⚠️ Warning: CO2 levels are high!',
      message: 'We reccommend to open windows, doors and HVAC to increase airflow exchange',
    });
  }
}

export default new Notifications();