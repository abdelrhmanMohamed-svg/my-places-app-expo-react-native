import { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
  hasServicesEnabledAsync,
  useForegroundPermissions,
  PermissionStatus,
  Accuracy,
} from 'expo-location';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import OutlinedButton from './ui/OutlinedButton';
import { getAddress } from '../util/location';
import { getLeafletHtml } from '../util/mapHtml';
import { Colors } from '../constants/colors';

export default function LocationPicker({ onPickLocation }) {
  const [pickedLocation, setPickedLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

  const navigation = useNavigation();
  const route = useRoute();
  const pickedLat = route.params?.pickedLat;
  const pickedLng = route.params?.pickedLng;

  // Check if user came back from Map screen with picked coordinates
  useFocusEffect(
    useCallback(() => {
      if (pickedLat && pickedLng) {
        const mapPickedLocation = {
          lat: pickedLat,
          lng: pickedLng,
        };
        setPickedLocation(mapPickedLocation);
      }
    }, [pickedLat, pickedLng])
  );

  // Once pickedLocation changes, reverse-geocode and notify parent
  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(pickedLocation.lat, pickedLocation.lng);
        onPickLocation({ ...pickedLocation, address });
      }
    }
    handleLocation();
  }, [pickedLocation, onPickLocation]);

  async function verifyPermissions() {
    if (!locationPermissionInformation || locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      if (locationPermissionInformation.canAskAgain) {
        const permissionResponse = await requestPermission();
        return permissionResponse.granted;
      }
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant location permissions in your device settings to use this feature.'
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsLocating(true);

      const isServicesEnabled = await hasServicesEnabledAsync();
      if (!isServicesEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please turn on GPS / Location services on your device.'
        );
        return;
      }

      let location;
      try {
        location = await getCurrentPositionAsync({
          accuracy: Accuracy.Balanced,
        });
      } catch (posErr) {
        console.warn('getCurrentPositionAsync failed, attempting last known location:', posErr);
        location = await getLastKnownPositionAsync({});
      }

      if (!location) {
        throw new Error('Could not acquire your GPS position. If using an emulator, please send a mock location or pick on map.');
      }

      console.log('Location acquired:', location);
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (err) {
      console.error('Error fetching location:', err);
      Alert.alert(
        'Could not fetch location!',
        err.message || 'Please try again later or pick a location on the map.'
      );
    } finally {
      setIsLocating(false);
    }
  }

  function pickOnMapHandler() {
    navigation.navigate('Map', {
      initialLat: pickedLocation?.lat,
      initialLng: pickedLocation?.lng,
    });
  }

  let locationPreview = <Text style={styles.fallbackText}>No location picked yet.</Text>;

  if (isLocating) {
    locationPreview = <ActivityIndicator style={styles.activityIndicator} size="large" color={Colors.primary600} />;
  } else if (pickedLocation) {
    locationPreview = (
      <WebView
        originWhitelist={['*']}
        source={{
          html: getLeafletHtml(pickedLocation.lat, pickedLocation.lng, false),
          baseUrl: 'https://unpkg.com/leaflet@1.9.4/dist/',
        }}
        style={styles.mapPreview}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        androidLayerType="software"
        nestedScrollEnabled={false}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.mapPreviewContainer,
          !pickedLocation && styles.centeredContainer,
        ]}
      >
        {locationPreview}
      </View>
      <View style={styles.actions}>
        <OutlinedButton
          icon="location"
          onPress={getLocationHandler}
          style={styles.actionButton}
        >
          Locate User
        </OutlinedButton>
        <OutlinedButton
          icon="map"
          onPress={pickOnMapHandler}
          style={styles.actionButton}
        >
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPreviewContainer: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    backgroundColor: Colors.primary50,
    borderRadius: 4,
    overflow: 'hidden',
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  fallbackText: {
    color: Colors.gray900,
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});
