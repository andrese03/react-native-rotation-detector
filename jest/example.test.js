/**
 * Example test file showing how to use react-native-rotation-detector mocks
 *
 * This demonstrates testing components that use the rotation hooks.
 *
 * Note: This is an example file. You'll need to install @testing-library/react-native
 * and set up the mocks in your own project to use this.
 */

/*
import { render, act } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { useRotation, useRotationComplete, __mockHelpers } from 'react-native-rotation-detector';

// Example component using useRotation
const RotationDisplay = () => {
  const { angle, label } = useRotation();
  
  return (
    <View>
      <Text testID="angle">{angle}°</Text>
      <Text testID="label">{label}</Text>
    </View>
  );
};

// Example component using useRotationComplete (Android-specific)
const RotationCompleteDisplay = () => {
  const { angle, label, isRotating } = useRotationComplete();
  
  return (
    <View>
      <Text testID="angle">{angle}°</Text>
      <Text testID="label">{label}</Text>
      <Text testID="status">{isRotating ? 'Rotating' : 'Stable'}</Text>
    </View>
  );
};

describe('RotationDisplay', () => {
  beforeEach(() => {
    // Reset mock state before each test
    __mockHelpers.reset();
  });

  it('displays initial portrait orientation', () => {
    const { getByTestId } = render(<RotationDisplay />);
    
    expect(getByTestId('angle').children[0]).toBe('0°');
    expect(getByTestId('label').children[0]).toBe('portrait');
  });

  it('updates when rotation changes', () => {
    const { getByTestId, rerender } = render(<RotationDisplay />);
    
    // Simulate rotation to landscape-left
    act(() => {
      __mockHelpers.setRotation(90);
    });
    
    rerender(<RotationDisplay />);
    
    expect(getByTestId('angle').children[0]).toBe('90°');
    expect(getByTestId('label').children[0]).toBe('landscape-left');
  });

  it('handles all rotation angles', () => {
    const { getByTestId, rerender } = render(<RotationDisplay />);
    
    const rotations = [
      { angle: 0, label: 'portrait' },
      { angle: 90, label: 'landscape-left' },
      { angle: 180, label: 'portrait-upside-down' },
      { angle: 270, label: 'landscape-right' },
    ];

    rotations.forEach(({ angle, label }) => {
      act(() => {
        __mockHelpers.setRotation(angle);
      });
      
      rerender(<RotationDisplay />);
      
      expect(getByTestId('angle').children[0]).toBe(`${angle}°`);
      expect(getByTestId('label').children[0]).toBe(label);
    });
  });
});

describe('RotationCompleteDisplay', () => {
  beforeEach(() => {
    __mockHelpers.reset();
  });

  it('displays initial state as stable', () => {
    const { getByTestId } = render(<RotationCompleteDisplay />);
    
    expect(getByTestId('status').children[0]).toBe('Stable');
  });

  it('shows rotating state during rotation', () => {
    const { getByTestId, rerender } = render(<RotationCompleteDisplay />);
    
    // Start rotation
    act(() => {
      __mockHelpers.setRotation(90, true);
    });
    
    rerender(<RotationCompleteDisplay />);
    
    expect(getByTestId('angle').children[0]).toBe('90°');
    expect(getByTestId('label').children[0]).toBe('landscape-left');
    expect(getByTestId('status').children[0]).toBe('Rotating');
  });

  it('shows stable state after rotation completes', () => {
    const { getByTestId, rerender } = render(<RotationCompleteDisplay />);
    
    // Start rotation
    act(() => {
      __mockHelpers.setRotation(90, true);
    });
    
    rerender(<RotationCompleteDisplay />);
    expect(getByTestId('status').children[0]).toBe('Rotating');
    
    // Complete rotation
    act(() => {
      __mockHelpers.completeRotation();
    });
    
    rerender(<RotationCompleteDisplay />);
    expect(getByTestId('status').children[0]).toBe('Stable');
  });

  it('provides current state through helper', () => {
    act(() => {
      __mockHelpers.setRotation(180, true);
    });
    
    const currentState = __mockHelpers.getCurrentState();
    
    expect(currentState).toEqual({
      angle: 180,
      label: 'portrait-upside-down',
      isRotating: true,
    });
  });
});
*/
