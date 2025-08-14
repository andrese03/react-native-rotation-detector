/**
 * Jest setup file for react-native-rotation-detector
 *
 * This file provides mocks for the react-native-rotation-detector library.
 * Include this in your Jest configuration to test components that use this library.
 *
 * @usage Add to your jest.config.js:
 * {
 *   setupFilesAfterEnv: ['react-native-rotation-detector/jest/setup.js']
 * }
 */

// Mock the native module
jest.mock('react-native-rotation-detector', () => {
  const mockRotationState = {
    angle: 0,
    label: 'portrait',
    isRotating: false,
  };

  let currentRotation = { ...mockRotationState };

  // Mock hooks with controllable state
  const useRotation = jest.fn(() => ({
    angle: currentRotation.angle,
    label: currentRotation.label,
  }));

  const useRotationComplete = jest.fn(() => ({
    angle: currentRotation.angle,
    label: currentRotation.label,
    isRotating: currentRotation.isRotating,
  }));

  // Helper functions for testing (attached to the mock)
  const mockHelpers = {
    /**
     * Simulate a rotation change
     * @param {0 | 90 | 180 | 270} angle - The new rotation angle
     * @param {boolean} isRotating - Whether rotation is in progress (for useRotationComplete)
     */
    setRotation: (angle, isRotating = false) => {
      const labels = {
        0: 'portrait',
        90: 'landscape-left',
        180: 'portrait-upside-down',
        270: 'landscape-right',
      };

      currentRotation = {
        angle,
        label: labels[angle] || 'portrait',
        isRotating,
      };

      // Trigger re-renders by updating the mock return values
      useRotation.mockReturnValue({
        angle: currentRotation.angle,
        label: currentRotation.label,
      });

      useRotationComplete.mockReturnValue({
        angle: currentRotation.angle,
        label: currentRotation.label,
        isRotating: currentRotation.isRotating,
      });
    },

    /**
     * Simulate Android rotation completion
     * Call this after setRotation with isRotating: true to simulate completion
     */
    completeRotation: () => {
      currentRotation.isRotating = false;
      useRotationComplete.mockReturnValue({
        angle: currentRotation.angle,
        label: currentRotation.label,
        isRotating: false,
      });
    },

    /**
     * Reset all mocks to initial state
     */
    reset: () => {
      currentRotation = { ...mockRotationState };
      useRotation.mockReturnValue({
        angle: currentRotation.angle,
        label: currentRotation.label,
      });
      useRotationComplete.mockReturnValue({
        angle: currentRotation.angle,
        label: currentRotation.label,
        isRotating: currentRotation.isRotating,
      });
    },

    /**
     * Get current mock state
     */
    getCurrentState: () => ({ ...currentRotation }),
  };

  // Attach helpers to the main export
  const mockExport = {
    useRotation,
    useRotationComplete,
    // Export helper functions for testing
    __mockHelpers: mockHelpers,
  };

  return mockExport;
});

// Also mock the native module directly in case it's imported separately
jest.mock('react-native-rotation-detector/src/NativeRotationDetector', () => ({
  default: {
    startRotationListener: jest.fn(),
    stopRotationListener: jest.fn(),
    startRotationCompletionListener: jest.fn(),
    stopRotationCompletionListener: jest.fn(),
    getCurrentRotation: jest.fn(() => 0),
  },
}));

// Mock DeviceEventEmitter if needed
jest.mock('react-native', () => {
  const actualRN = jest.requireActual('react-native');
  return {
    ...actualRN,
    DeviceEventEmitter: {
      addListener: jest.fn(() => ({
        remove: jest.fn(),
      })),
      removeListener: jest.fn(),
    },
    Platform: {
      OS: 'ios', // Default to iOS, can be overridden in tests
    },
  };
});
