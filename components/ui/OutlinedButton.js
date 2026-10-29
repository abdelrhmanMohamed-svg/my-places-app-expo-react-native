import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export default function OutlinedButton({ onPress, icon, children, style, color }) {
  const themeColor = color || Colors.primary500;
  const borderColor = color || Colors.primary600;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        color && { borderColor },
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      {icon && <Ionicons style={styles.icon} name={icon} size={18} color={themeColor} />}
      <Text style={[styles.text, color && { color: themeColor }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary600,
    borderRadius: 4,
    backgroundColor: Colors.transparent,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: Colors.ripple,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: Colors.primary500,
    fontSize: 15,
    fontWeight: '600',
  },
});
