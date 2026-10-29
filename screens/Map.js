import { useState, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

import IconButton from '../components/ui/IconButton';
import { getLeafletHtml } from '../util/mapHtml';

export default function Map({ navigation, route }) {
  const initialLocation = route.params && {
    lat: route.params.initialLat || 37.78825,
    lng: route.params.initialLng || -122.4324,
  };

  const isReadOnly = route.params?.readOnly;

  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: 37.78825, lng: -122.4324 }
  );

  const savePickedLocationHandler = useCallback(() => {
    console.log("selected location", selectedLocation);
    if (!selectedLocation) {
      Alert.alert(
        'No location picked!',
        'You have to pick a location (by tapping on the map) first!'
      );
      return;
    }

    navigation.popTo('AddPlace', {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }, [navigation, selectedLocation]);

  useLayoutEffect(() => {
    if (isReadOnly) {
      return;
    }

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, isReadOnly]);

  function onMessage(event) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'LOCATION_SELECTED') {
        setSelectedLocation({ lat: data.lat, lng: data.lng });
      }
    } catch (e) {
      console.warn('Error parsing message from map WebView:', e);
    }
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{
          html: getLeafletHtml(
            selectedLocation.lat,
            selectedLocation.lng,
            !isReadOnly
          ),
          baseUrl: 'https://unpkg.com/leaflet@1.9.4/dist/',
        }}
        style={styles.map}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
