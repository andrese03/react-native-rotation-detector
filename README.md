# react-native-rotation-detector

Detect real device rotation angles (0°, 90°, 180°, 270°) in React Native with lightweight native code for iOS and Android.

## Minimum Requirements

### React Native

- **React Native**: 0.68.0 or higher
- **React**: 16.8.0 or higher (for hooks support)

### iOS

- **iOS**: 11.0 or higher
- **Xcode**: 13.0 or higher
- **CocoaPods**: 1.10.0 or higher

### Android

- **minSdkVersion**: 21 (Android 5.0)
- **compileSdkVersion**: 33 or higher
- **targetSdkVersion**: 33 or higher
- **Android Gradle Plugin**: 7.0 or higher
- **Gradle**: 7.0 or higher
- **Kotlin**: 1.7.0 or higher

## Installation

```sh
npm install react-native-rotation-detector
# or
yarn add react-native-rotation-detector
```

### Auto-linking (React Native 0.60+)

This library supports auto-linking. No manual installation steps are required for React Native 0.60+.

#### iOS Auto-linking

1. Run `cd ios && pod install` (if not using React Native 0.71+ with automatic CocoaPods integration)
1. No additional setup required

#### Android Auto-linking

1. No additional setup required - auto-linking handles everything

### Manual Installation (React Native < 0.60)

#### iOS Manual Installation

1. Add to your `Podfile`:

```ruby
pod 'RotationDetector', :path => '../node_modules/react-native-rotation-detector'
```

1. Run `cd ios && pod install`

#### Android Manual Installation

1. Add to `android/settings.gradle`:

```gradle
include ':react-native-rotation-detector'
project(':react-native-rotation-detector').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-rotation-detector/android')
```

1. Add to `android/app/build.gradle`:

```gradle
dependencies {
    implementation project(':react-native-rotation-detector')
}
```

1. Add to your `MainApplication.java`:

```java
import com.rotationdetector.RotationDetectorPackage;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new RotationDetectorPackage() // Add this line
    );
}
```

## Usage

### Basic Usage

```js
import { useRotation } from 'react-native-rotation-detector';

function MyComponent() {
  const { angle, label } = useRotation();

  return (
    <View>
      <Text>Current rotation: {angle}°</Text>
      <Text>Orientation: {label}</Text>
    </View>
  );
}
```

### Available Values

The `useRotation` hook returns an object with:

- `angle`: The exact rotation angle (`0 | 90 | 180 | 270`)
- `label`: Human-readable orientation label:
  - `'portrait'` (0°)
  - `'landscape-left'` (90°)
  - `'portrait-upside-down'` (180°)
  - `'landscape-right'` (270°)

### Platform Differences

- **iOS**: Uses `DeviceEventEmitter` to listen for orientation changes via `UIDevice` notifications
- **Android**: Uses native `OrientationEventListener` for precise rotation tracking with raw degree bucketing

## API Reference

### `useRotation(): UseRotationResult`

React hook that returns the current device rotation state.

**Returns:**

```typescript
interface UseRotationResult {
  angle: RotationDeg;  // 0 | 90 | 180 | 270
  label: RotationLabel; // 'portrait' | 'landscape-left' | 'portrait-upside-down' | 'landscape-right'
}
```

### Types

```typescript
export type RotationDeg = 0 | 90 | 180 | 270;
export type RotationLabel =
  | 'portrait'
  | 'portrait-upside-down'
  | 'landscape-left'
  | 'landscape-right';
```

## Troubleshooting

### iOS Issues

- **Build errors**: Ensure your iOS deployment target is 11.0 or higher
- **Pod installation fails**: Run `cd ios && pod install --repo-update`
- **Swift compilation errors**: Ensure Xcode 13.0+ is being used

### Android Issues

- **Build errors**: Ensure your `minSdkVersion` is 21 or higher
- **Auto-linking not working**: Try running `npx react-native unlink react-native-rotation-detector` then `npx react-native link react-native-rotation-detector`
- **Kotlin compilation errors**: Ensure Kotlin 1.7.0+ is configured in your project

### General Issues

- **Hook not updating**: Ensure your React Native version supports TurboModules (0.68+)
- **Events not firing**: Check that your app has the necessary orientation permissions enabled

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
