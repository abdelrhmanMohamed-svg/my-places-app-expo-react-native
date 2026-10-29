import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function Button({ onPress, children, style }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 8,
    backgroundColor: Colors.primary700,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.primary500,
    fontWeight: 'bold',
  },
});
