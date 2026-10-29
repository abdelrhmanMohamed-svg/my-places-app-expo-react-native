import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  launchImageLibraryAsync,
} from 'expo-image-picker';
import OutlinedButton from './ui/OutlinedButton';
import { Colors } from '../constants/colors';

export default function ImagePicker({ onTakeImage }) {
  const [pickedImage, setPickedImage] = useState(null);
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant camera permissions to use this app.'
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      const image = await launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!image.canceled && image.assets && image.assets.length > 0) {
        const uri = image.assets[0].uri;
        setPickedImage(uri);
        onTakeImage(uri);
      }
    } catch (_err) {
      // In case camera isn't available (e.g. simulator without mock camera), offer library fallback
      Alert.alert(
        'Camera not available',
        'Would you like to select an image from your photo library instead?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Pick from Gallery',
            onPress: async () => {
              const result = await launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.7,
              });
              if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setPickedImage(uri);
                onTakeImage(uri);
              }
            },
          },
        ]
      );
    }
  }

  let imagePreview = <Text style={styles.fallbackText}>No image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary50,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackText: {
    color: Colors.gray900,
    fontSize: 16,
    fontWeight: '500',
  },
});
