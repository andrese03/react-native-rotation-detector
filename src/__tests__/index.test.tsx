import { useRotation } from '../index';

// Mock the native module
jest.mock('../NativeRotationDetector', () => ({
  __esModule: true,
  default: {
    startRotationListener: jest.fn(),
    stopRotationListener: jest.fn(),
    getCurrentRotation: jest.fn(() => 0),
  },
}));

// Mock DeviceEventEmitter
jest.mock('react-native', () => ({
  DeviceEventEmitter: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('RotationDetector', () => {
  it('should export useRotation hook', () => {
    expect(typeof useRotation).toBe('function');
  });

  it('should export proper TypeScript types', () => {
    // Just verify the module exports what we expect
    expect(useRotation).toBeDefined();
  });
});
