import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { useRotation, multiply } from 'react-native-rotation-detector';

/**
 * Example app demonstrating the useRotation hook
 *
 * Shows real-time rotation angle and orientation label
 * as the device is rotated between different orientations.
 */
export default function App() {
  // Get current rotation state using the custom hook
  const { angle, label } = useRotation();

  // Legacy multiply function test
  const mathResult = multiply(3, 7);

  // Get rotation indicator based on current angle
  const getRotationIndicator = () => {
    switch (angle) {
      case 0:
        return '📱'; // Portrait
      case 90:
        return '📱'; // Landscape-left (rotated counter-clockwise)
      case 180:
        return '🙃'; // Portrait-upside-down
      case 270:
        return '📱'; // Landscape-right (rotated clockwise)
      default:
        return '📱';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔄 Rotation Detector</Text>

        <View style={styles.rotationInfo}>
          <Text style={styles.indicator}>{getRotationIndicator()}</Text>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Current Rotation</Text>
            <Text style={styles.angle}>{angle}°</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Orientation</Text>
            <Text style={styles.orientationLabel}>{label}</Text>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Instructions:</Text>
          <Text style={styles.instructionText}>
            • Rotate your device to see live angle updates
          </Text>
          <Text style={styles.instructionText}>
            • Works in all 4 orientations (0°, 90°, 180°, 270°)
          </Text>
          <Text style={styles.instructionText}>
            • Detects landscape-left vs landscape-right
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Math test: 3 × 7 = {mathResult}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  rotationInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  indicator: {
    fontSize: 60,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  angle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  orientationLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
