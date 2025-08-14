import { useEffect, useState } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import RotationDetector from './NativeRotationDetector';

// Type definitions for rotation
export type RotationDeg = 0 | 90 | 180 | 270;
export type RotationLabel =
  | 'portrait'
  | 'portrait-upside-down'
  | 'landscape-left'
  | 'landscape-right';

export interface UseRotationCompleteResult {
  angle: RotationDeg;
  label: RotationLabel;
  isRotating: boolean;
}

/**
 * Maps rotation angle to human-readable label
 * @param angle - The rotation angle in degrees (0, 90, 180, 270)
 * @returns The corresponding rotation label
 */
function angleToLabel(angle: RotationDeg): RotationLabel {
  switch (angle) {
    case 0:
      return 'portrait';
    case 90:
      return 'landscape-left';
    case 180:
      return 'portrait-upside-down';
    case 270:
      return 'landscape-right';
    default:
      return 'portrait';
  }
}

/**
 * Buckets raw Android rotation degrees to standard angles
 * @param rawDegrees - Raw rotation degrees from Android OrientationEventListener
 * @returns The bucketed rotation angle (0, 90, 180, 270)
 */
function bucketAndroidRotation(rawDegrees: number): RotationDeg {
  // Normalize to 0-360 range
  const normalized = ((rawDegrees % 360) + 360) % 360;

  // Bucket to nearest standard rotation
  if (normalized >= 315 || normalized < 45) {
    return 0; // Portrait
  } else if (normalized >= 45 && normalized < 135) {
    return 270; // Landscape-right (device rotated clockwise)
  } else if (normalized >= 135 && normalized < 225) {
    return 180; // Portrait-upside-down
  } else {
    return 90; // Landscape-left (device rotated counter-clockwise)
  }
}

/**
 * React hook to detect device rotation completion (v1.1.0+)
 *
 * ⚠️ ANDROID ONLY: This hook is only available on Android devices.
 *
 * This hook waits for the rotation animation to complete before updating the state.
 * It uses configuration changes and screen orientation changes to detect when rotation finishes.
 *
 * On Android: Uses configuration change broadcasts to detect when rotation finishes
 * On iOS/other platforms: Returns early with error logging in development mode
 *
 * @returns Object containing current rotation angle, label, and rotation status
 * @throws Error on non-Android platforms in development mode
 */
export function useRotationComplete(): UseRotationCompleteResult {
  const [angle, setAngle] = useState<RotationDeg>(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    // Check if running on iOS and handle accordingly
    if (Platform.OS !== 'android') {
      if (__DEV__) {
        console.error(
          'useRotationComplete is only available on Android. Please use the regular rotation detection methods for iOS.'
        );
        // In development, we'll still return default values to prevent crashes
        // but log an error to help developers notice the issue
      }
      // On non-Android platforms, just return early without setting up any listeners
      return;
    }
    let completionSubscription: any;
    let immediateSubscription: any;

    // Helper function to handle rotation completion
    const handleRotationComplete = (newAngle: RotationDeg) => {
      setAngle(newAngle);
      setIsRotating(false);
    };

    // Set up completion listener (Android only)
    completionSubscription = DeviceEventEmitter.addListener(
      'rotationCompleted',
      (data: any) => {
        if (data && typeof data.degrees === 'number') {
          const newAngle = bucketAndroidRotation(data.degrees);
          handleRotationComplete(newAngle);
        }
      }
    );

    // Set up immediate listener to detect rotation start (Android only)
    immediateSubscription = DeviceEventEmitter.addListener(
      'rotationChanged',
      (data: any) => {
        if (data && typeof data.degrees === 'number') {
          const newAngle = bucketAndroidRotation(data.degrees);
          setAngle((currentAngle) => {
            if (newAngle !== currentAngle) {
              setIsRotating(true);
            }
            return currentAngle;
          });
        }
      }
    );

    // Start the native listeners (Android only)
    try {
      RotationDetector.startRotationCompletionListener();
      RotationDetector.startRotationListener(); // For immediate rotation detection
    } catch (error) {
      console.warn('Failed to start rotation completion listener:', error);
    }

    // Get initial rotation (Android only)
    try {
      const currentRotation = RotationDetector.getCurrentRotation();
      const initialAngle = bucketAndroidRotation(currentRotation);
      setAngle(initialAngle);
    } catch (error) {
      console.warn('Failed to get current rotation:', error);
    }

    // Cleanup function
    return () => {
      if (completionSubscription) {
        completionSubscription.remove();
      }

      if (immediateSubscription) {
        immediateSubscription.remove();
      }

      try {
        RotationDetector.stopRotationCompletionListener();
        RotationDetector.stopRotationListener();
      } catch (error) {
        console.warn('Failed to stop rotation completion listener:', error);
      }
    };
  }, []);

  return {
    angle,
    label: angleToLabel(angle),
    isRotating,
  };
}
