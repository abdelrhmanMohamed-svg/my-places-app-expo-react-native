import { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';

import ImagePicker from '../ImagePicker';
import LocationPicker from '../LocationPicker';
import Button from '../ui/Button';
import { Place } from '../../models/place';
import { Colors } from '../../constants/colors';

export default function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location) => {
    setPickedLocation(location);
  }, []);

  function savePlaceHandler() {
    if (!enteredTitle.trim()) {
      Alert.alert('Invalid input', 'Please provide a valid place title.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('No image selected', 'Please take an image first.');
      return;
    }

    if (!pickedLocation) {
      Alert.alert('No location selected', 'Please locate yourself or pick on map.');
      return;
    }

    const placeData = new Place(enteredTitle, selectedImage, pickedLocation);
    onCreatePlace(placeData);
  }

  return (
    <ScrollView style={styles.form} contentContainerStyle={styles.contentContainer}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
          placeholderTextColor={Colors.gray400}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} />
      <LocationPicker onPickLocation={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.primary500,
    fontSize: 16,
  },
  input: {
    marginVertical: 4,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: Colors.primary50,
    borderRadius: 4,
    color: Colors.gray900,
  },
});
