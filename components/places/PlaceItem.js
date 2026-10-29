import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

export default function PlaceItem({ place, onSelect }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={onSelect.bind(this, place.id)}
    >
      <Image style={styles.image} source={{ uri: place.imageUri }} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {place.title}
        </Text>
        <Text style={styles.address} numberOfLines={2}>
          {place.address}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 8,
    backgroundColor: Colors.cardBackground,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: Colors.gray500,
  },
});
