/**
 * Manual mock for react-native-rotation-detector
 *
 * Place this file at __mocks__/react-native-rotation-detector.js in your project
 * to automatically mock the library in your Jest tests.
 *
 * Alternatively, import this in your test setup files.
 */

const mockRotationState = {
  angle: 0,
  label: 'portrait',
  isRotating: false,
};

let currentRotation = { ...mockRotationState };

// Mock hooks with controllable state
const useRotation = () => ({
  angle: currentRotation.angle,
  label: currentRotation.label,
});

const useRotationComplete = () => ({
  angle: currentRotation.angle,
  label: currentRotation.label,
  isRotating: currentRotation.isRotating,
});

// Helper functions for testing
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
  },

  /**
   * Simulate Android rotation completion
   * Call this after setRotation with isRotating: true to simulate completion
   */
  completeRotation: () => {
    currentRotation.isRotating = false;
  },

  /**
   * Reset all mocks to initial state
   */
  reset: () => {
    currentRotation = { ...mockRotationState };
  },

  /**
   * Get current mock state
   */
  getCurrentState: () => ({ ...currentRotation }),
};

// Export the mocked functions and helpers
module.exports = {
  useRotation,
  useRotationComplete,
  // Export helper functions for testing
  __mockHelpers: mockHelpers,
  // Also export types for TypeScript users
  RotationDeg: undefined, // Type export
  RotationLabel: undefined, // Type export
  UseRotationResult: undefined, // Type export
  UseRotationCompleteResult: undefined, // Type export
};
