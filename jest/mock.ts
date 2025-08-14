/**
 * TypeScript mock for react-native-rotation-detector
 * Place this file at __mocks__/react-native-rotation-detector.ts in your project
 * to automatically mock the library in your Jest tests.
 */

import type {
  RotationDeg,
  RotationLabel,
  UseRotationResult,
  UseRotationCompleteResult,
} from '../src/index';

interface MockRotationState {
  angle: RotationDeg;
  label: RotationLabel;
  isRotating: boolean;
}

const mockRotationState: MockRotationState = {
  angle: 0,
  label: 'portrait',
  isRotating: false,
};

let currentRotation = { ...mockRotationState };

// Mock hooks with controllable state
export const useRotation = (): UseRotationResult => ({
  angle: currentRotation.angle,
  label: currentRotation.label,
});

export const useRotationComplete = (): UseRotationCompleteResult => ({
  angle: currentRotation.angle,
  label: currentRotation.label,
  isRotating: currentRotation.isRotating,
});

// Helper functions for testing
export const __mockHelpers = {
  /**
   * Simulate a rotation change
   * @param angle - The new rotation angle
   * @param isRotating - Whether rotation is in progress (for useRotationComplete)
   */
  setRotation: (angle: RotationDeg, isRotating = false): void => {
    const labels: Record<RotationDeg, RotationLabel> = {
      0: 'portrait',
      90: 'landscape-left',
      180: 'portrait-upside-down',
      270: 'landscape-right',
    };

    currentRotation = {
      angle,
      label: labels[angle],
      isRotating,
    };
  },

  /**
   * Simulate Android rotation completion
   * Call this after setRotation with isRotating: true to simulate completion
   */
  completeRotation: (): void => {
    currentRotation.isRotating = false;
  },

  /**
   * Reset all mocks to initial state
   */
  reset: (): void => {
    currentRotation = { ...mockRotationState };
  },

  /**
   * Get current mock state
   */
  getCurrentState: (): MockRotationState => ({ ...currentRotation }),
};

// Re-export types
export type {
  RotationDeg,
  RotationLabel,
  UseRotationResult,
  UseRotationCompleteResult,
};
