import { useEffect, useState, useCallback } from 'react';
import { ScrollView, Image, View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import OutlinedButton from '../components/ui/OutlinedButton';
import IconButton from '../components/ui/IconButton';
import { fetchPlaceDetails, deletePlace } from '../util/database';
import { Colors } from '../constants/colors';

export default function PlaceDetails({ route, navigation }) {
  const [fetchedPlace, setFetchedPlace] = useState(null);

  const selectedPlaceId = route.params.placeId;

  function showOnMapHandler() {
    navigation.navigate('Map', {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
      readOnly: true,
    });
  }

  const deletePlaceHandler = useCallback(() => {
    Alert.alert(
      'Delete Place',
      'Are you sure you want to delete this place? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlace(selectedPlaceId);
              navigation.goBack();
            } catch (err) {
              console.error('Failed to delete place:', err);
              Alert.alert('Error', 'Could not delete the place. Please try again.');
            }
          },
        },
      ]
    );
  }, [selectedPlaceId, navigation]);

  useEffect(() => {
    async function loadPlaceData() {
      const place = await fetchPlaceDetails(selectedPlaceId);
      setFetchedPlace(place);
      navigation.setOptions({
        title: place ? place.title : 'Loading...',
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="trash"
            size={24}
            color={tintColor}
            onPress={deletePlaceHandler}
          />
        ),
      });
    }

    loadPlaceData();
  }, [selectedPlaceId, navigation, deletePlaceHandler]);

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <ActivityIndicator size="large" color={Colors.primary500} />
        <Text style={styles.fallbackText}>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <OutlinedButton icon="map" onPress={showOnMapHandler}>
            View on Map
          </OutlinedButton>
          <OutlinedButton
            icon="trash"
            color={Colors.error500}
            onPress={deletePlaceHandler}
          >
            Delete Place
          </OutlinedButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray700,
  },
  fallbackText: {
    color: Colors.primary500,
    marginTop: 12,
    fontSize: 16,
  },
  container: {
    paddingBottom: 32,
  },
  image: {
    height: '45%',
    minHeight: 300,
    width: '100%',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  addressContainer: {
    padding: 16,
    marginBottom: 16,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 22,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
});
