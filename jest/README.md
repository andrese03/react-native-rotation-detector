# Jest Testing Setup for react-native-rotation-detector

This directory contains Jest mocks and testing utilities for the `react-native-rotation-detector` library.

## Quick Setup

### Option 1: Automatic Mock (Recommended)

Create a `__mocks__` directory in your project root and copy the appropriate mock file:

**For JavaScript projects:**

```bash
mkdir -p __mocks__
cp node_modules/react-native-rotation-detector/jest/mock.js __mocks__/react-native-rotation-detector.js
```

**For TypeScript projects:**

```bash
mkdir -p __mocks__
cp node_modules/react-native-rotation-detector/jest/mock.ts __mocks__/react-native-rotation-detector.ts
```

### Option 2: Manual Mock in Test Files

Import the mock directly in your test files:

```javascript
import { __mockHelpers } from 'react-native-rotation-detector';

// In your tests, the hooks will automatically be mocked
```

## Usage in Tests

### Basic Example

```javascript
import React from 'react';
import { render } from '@testing-library/react-native';
import { useRotation, __mockHelpers } from 'react-native-rotation-detector';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    // Reset to default state before each test
    __mockHelpers.reset();
  });

  it('responds to rotation changes', () => {
    const { getByTestId, rerender } = render(<MyComponent />);

    // Simulate rotation to landscape
    __mockHelpers.setRotation(90);
    rerender(<MyComponent />);

    // Assert your component's behavior
    expect(getByTestId('orientation')).toHaveTextContent('landscape-left');
  });
});
```

### Testing Android Rotation Completion

```javascript
it('handles rotation completion on Android', () => {
  const { getByTestId, rerender } = render(<MyComponent />);

  // Start rotation
  __mockHelpers.setRotation(90, true); // isRotating = true
  rerender(<MyComponent />);

  expect(getByTestId('status')).toHaveTextContent('Rotating');

  // Complete rotation
  __mockHelpers.completeRotation();
  rerender(<MyComponent />);

  expect(getByTestId('status')).toHaveTextContent('Stable');
});
```

## Mock API

### Helper Functions

- **`__mockHelpers.setRotation(angle, isRotating?)`**: Simulate rotation change
  - `angle`: `0 | 90 | 180 | 270`
  - `isRotating`: `boolean` (default: `false`)

- **`__mockHelpers.completeRotation()`**: Mark rotation as complete (sets `isRotating` to `false`)

- **`__mockHelpers.reset()`**: Reset to initial state (portrait, not rotating)

- **`__mockHelpers.getCurrentState()`**: Get current mock state

### Mocked Hooks

Both `useRotation()` and `useRotationComplete()` are automatically mocked and will return values based on the current mock state.

## Platform Testing

To test platform-specific behavior:

```javascript
import { Platform } from 'react-native';

beforeEach(() => {
  // Mock Android
  Platform.OS = 'android';

  // Or mock iOS
  Platform.OS = 'ios';
});
```

## Example Test File

See `jest/example.test.tsx` for a complete example showing how to test components using both rotation hooks.

## Notes

- The mocks are designed to work with React Native Testing Library
- All rotation transitions are supported (including landscape-left ↔ landscape-right)
- TypeScript definitions are included for type safety
- Platform-specific behavior can be tested by mocking `Platform.OS`
