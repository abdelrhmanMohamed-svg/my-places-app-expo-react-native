import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import { Platform } from 'react-native';

export const INACTIVITY_REMINDER_ID = 'place-inactivity-reminder';

// ⏱️ Configuration:
// For demo purposes: 5 seconds.
// For production (5 days later): change to 5 * 24 * 60 * 60
export const REMINDER_DELAY_SECONDS = 5;

// Define how notifications should be handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Configure high-importance channel on Android for heads-up notifications
export async function setupNotificationChannelsAsync() {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    } catch (error) {
      console.warn('Could not configure custom notification channel (non-fatal):', error);
    }
  }
}

// Request permissions if not already granted
export async function requestNotificationPermissionsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  let granted = settings.granted || settings.ios?.status === IosAuthorizationStatus?.PROVISIONAL;

  if (!granted) {
    const request = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    granted = request.granted;
  }
  return granted;
}

// Cancel any existing scheduled reminder
export async function cancelPlaceReminder() {
  try {
    await Notifications.cancelScheduledNotificationAsync(INACTIVITY_REMINDER_ID);
  } catch (error) {
    console.warn('Failed to cancel existing reminder:', error);
  }
}

// Schedule inactivity reminder notification
export async function schedulePlaceReminder(seconds = REMINDER_DELAY_SECONDS) {
  try {
    // Cancel any prior scheduled reminder before setting a new one
    await cancelPlaceReminder();

    const hasPermission = await requestNotificationPermissionsAsync();
    if (!hasPermission) {
      console.warn('Notification permission not granted.');
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      identifier: INACTIVITY_REMINDER_ID,
      content: {
        title: 'Add a place now! 📍',
        body: "You haven't added a place for too long. Tap to add a new favorite place now!",
        data: { screen: 'AddPlace' },
        sound: true,
      },
      trigger: {
        seconds: seconds,
        channelId: 'default',
      },
    });

    console.log(`Notification scheduled with ID "${id}" for ${seconds} seconds from now.`);
    return id;
  } catch (error) {
    console.error('Failed to schedule place reminder notification:', error);
    return null;
  }
}
