import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import PlaceItem from './PlaceItem';
import { Colors } from '../../constants/colors';

export default function PlacesList({ places }) {
  const navigation = useNavigation();

  function selectPlaceHandler(id) {
    navigation.navigate('PlaceDetails', {
      placeId: id,
    });
  }

  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          No places added yet - start adding some!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={places}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PlaceItem place={item} onSelect={selectPlaceHandler} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.primary100,
    textAlign: 'center',
  },
});
