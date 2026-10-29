import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './ui/Button';
import { Colors } from '../constants/colors';

export default function ErrorScreen({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={64} color={Colors.error500} />
      <Text style={styles.title}>Database Error</Text>
      <Text style={styles.message}>
        {message || 'Failed to initialize the local database.'}
      </Text>
      {onRetry && (
        <Button onPress={onRetry} style={styles.button}>
          Retry
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.error500,
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: Colors.gray100,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    minWidth: 160,
  },
});
