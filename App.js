import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import PlaceDetails from './screens/PlaceDetails';
import Map from './screens/Map';
import IconButton from './components/ui/IconButton';
import ErrorScreen from './components/ErrorScreen';
import { Colors } from './constants/colors';
import { init } from './util/database';
import {
  setupNotificationChannelsAsync,
  requestNotificationPermissionsAsync,
} from './util/notifications';

// Prevent native splash screen from hiding automatically while resources load
SplashScreen.preventAutoHideAsync().catch(() => { });

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  async function retryInit() {
    try {
      setInitError(null);
      await init();
      setDbInitialized(true);
    } catch (err) {
      console.error('Failed to initialize database:', err);
      setInitError(err.message || 'Could not connect to or create the database.');
    } finally {
      await SplashScreen.hideAsync().catch(() => { });
    }

    try {
      await setupNotificationChannelsAsync();
      await requestNotificationPermissionsAsync();
    } catch (notifErr) {
      console.warn('Failed to configure notifications:', notifErr);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadResources() {
      try {
        await init();
        if (isMounted) {
          setDbInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize database:', err);
        if (isMounted) {
          setInitError(err.message || 'Could not connect to or create the database.');
        }
      } finally {
        await SplashScreen.hideAsync().catch(() => { });
      }

      try {
        await setupNotificationChannelsAsync();
        await requestNotificationPermissionsAsync();
      } catch (notifErr) {
        console.warn('Failed to configure notifications:', notifErr);
      }
    }

    loadResources();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Listen for notification taps when app is foregrounded or in background
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const targetScreen = response?.notification?.request?.content?.data?.screen;
        console.log('Notification tapped (listener):', targetScreen);
        if (targetScreen && navigationRef.isReady()) {
          navigationRef.navigate(targetScreen);
          console.log('Navigating to:', targetScreen);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  function onNavigationReady() {
    // Check if the app was launched by tapping a notification from a killed state
    const response = Notifications.getLastNotificationResponse();
    const targetScreen = response?.notification?.request?.content?.data?.screen;
    console.log('Notification tapped (onReady):', targetScreen);
    if (targetScreen && navigationRef.isReady()) {
      navigationRef.navigate(targetScreen);
      console.log('Navigating to:', targetScreen);
    }
  }

  if (initError) {
    return (
      <ErrorScreen
        message={initError}
        onRetry={retryInit}
      />
    );
  }

  if (!dbInitialized) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.headerBackground },
            headerTintColor: Colors.gray800,
            contentStyle: { backgroundColor: Colors.gray700 },
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: 'Your Favorite Places',
              headerBackVisible: false,
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={26}
                  color={tintColor}
                  onPress={() => navigation.navigate('AddPlace')}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AddPlace"
            component={AddPlace}
            options={{
              title: 'Add a new Place',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="PlaceDetails"
            component={PlaceDetails}
            options={{
              title: 'Loading Place...',
            }}
          />
          <Stack.Screen
            name="Map"
            component={Map}
            options={{
              title: 'Map',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

