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

export interface UseRotationResult {
  angle: RotationDeg;
  label: RotationLabel;
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
 * Maps iOS orientation names to rotation angles
 * @param orientationName - iOS orientation name from DeviceEventEmitter
 * @returns The corresponding rotation angle
 */
function iOSOrientationToAngle(orientationName: string): RotationDeg {
  switch (orientationName) {
    case 'UIDeviceOrientationPortrait':
      return 0;
    case 'UIDeviceOrientationLandscapeLeft':
      return 90;
    case 'UIDeviceOrientationPortraitUpsideDown':
      return 180;
    case 'UIDeviceOrientationLandscapeRight':
      return 270;
    default:
      return 0;
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
 * React hook to detect device rotation changes
 *
 * Returns both the exact rotation angle (0°, 90°, 180°, 270°) and
 * a human-readable label for the current device orientation.
 *
 * On iOS: Uses DeviceEventEmitter to listen for orientation changes
 * On Android: Uses native OrientationEventListener for precise rotation tracking
 *
 * @returns Object containing current rotation angle and label
 */
export function useRotation(): UseRotationResult {
  const [angle, setAngle] = useState<RotationDeg>(0);

  useEffect(() => {
    let subscription: any;

    if (Platform.OS === 'ios') {
      // iOS: Listen for device orientation changes
      subscription = DeviceEventEmitter.addListener(
        'namedOrientationDidChange',
        (data: any) => {
          if (data && data.name) {
            const newAngle = iOSOrientationToAngle(data.name);
            setAngle(newAngle);
          }
        }
      );
    } else if (Platform.OS === 'android') {
      // Android: Listen for rotation changes from native module
      subscription = DeviceEventEmitter.addListener(
        'rotationChanged',
        (data: any) => {
          if (data && typeof data.degrees === 'number') {
            const newAngle = bucketAndroidRotation(data.degrees);
            setAngle(newAngle);
          }
        }
      );

      // Start the native rotation listener
      try {
        RotationDetector.startRotationListener();
      } catch (error) {
        console.warn('Failed to start rotation listener:', error);
      }
    }

    // Get initial rotation
    try {
      const currentRotation = RotationDetector.getCurrentRotation();
      if (Platform.OS === 'android') {
        setAngle(bucketAndroidRotation(currentRotation));
      } else {
        // For iOS, getCurrentRotation should return already bucketed value
        setAngle(currentRotation as RotationDeg);
      }
    } catch (error) {
      console.warn('Failed to get current rotation:', error);
    }

    // Cleanup function
    return () => {
      if (subscription) {
        subscription.remove();
      }

      if (Platform.OS === 'android') {
        try {
          RotationDetector.stopRotationListener();
        } catch (error) {
          console.warn('Failed to stop rotation listener:', error);
        }
      }
    };
  }, []);

  return {
    angle,
    label: angleToLabel(angle),
  };
}

// Legacy export for backward compatibility
export function multiply(a: number, b: number): number {
  return RotationDetector.multiply(a, b);
}
