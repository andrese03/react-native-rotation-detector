import { Text, View, StyleSheet } from 'react-native';
import { useRotation } from '../../src';

/**
 * Clean example app showing all rotation hook values
 */
export default function App() {
  // Get all values from the rotation hook
  const rotationData = useRotation();
  const { angle, label } = rotationData;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Current Orientation</Text>
        <Text style={styles.orientation}>{label}</Text>

        <Text style={styles.subtitle}>Angle</Text>
        <Text style={styles.angle}>{angle}°</Text>

        <Text style={styles.subtitle}>All Hook Values</Text>
        <Text style={styles.hookData}>
          {JSON.stringify(rotationData, null, 2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  orientation: {
    fontSize: 32,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  angle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 32,
    textAlign: 'center',
  },
  hookData: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333333',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    textAlign: 'left',
    maxWidth: '100%',
  },
});
