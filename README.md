# react-native-rotation-detector

[![npm version](https://badge.fury.io/js/react-native-rotation-detector.svg)](https://badge.fury.io/js/react-native-rotation-detector)
[![npm downloads](https://img.shields.io/npm/dm/react-native-rotation-detector.svg)](https://www.npmjs.com/package/react-native-rotation-detector)
[![GitHub license](https://img.shields.io/github/license/andrese03/react-native-rotation-detector.svg)](https://github.com/andrese03/react-native-rotation-detector/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/andrese03/react-native-rotation-detector.svg?style=social&label=Star)](https://github.com/andrese03/react-native-rotation-detector)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/andrese03?style=social)](https://github.com/sponsors/andrese03)

Detect real device rotation angles (0°, 90°, 180°, 270°) in React Native with lightweight native code for iOS and Android.

## 🚀 Features

- **🎯 Precise Detection**: Exact rotation angles (0°, 90°, 180°, 270°)
- **⚡ Lightweight**: Zero dependencies, minimal bundle size
- **🔗 Auto-linking**: Works out of the box with React Native 0.60+
- **🏗️ TurboModule**: Modern architecture for better performance
- **📱 Cross-platform**: iOS and Android support with platform-optimized implementations
- **🔧 TypeScript**: Full type definitions included
- **🎣 React Hooks**: `useRotation()` for immediate updates, `useRotationComplete()` for Android completion detection
- **🔄 Complete Transitions**: Supports landscape-left ↔ landscape-right transitions on Android

## 📦 Package Stats

- **Bundle Size**: ~2KB minified + gzipped
- **Dependencies**: 0 (zero dependencies!)
- **TypeScript**: ✅ Built-in support
- **Auto-linking**: ✅ React Native 0.60+
- **TurboModule**: ✅ New Architecture ready

## 🤔 Why Choose This Package?

| Feature | react-native-rotation-detector | Others |
|---------|-------------------------------|--------|
| **Bundle Size** | ~2KB | Often 10KB+ |
| **Dependencies** | 0 | Usually multiple |
| **Auto-linking** | ✅ Built-in | ❌ Manual setup |
| **TurboModule** | ✅ Modern | ❌ Legacy bridge |
| **TypeScript** | ✅ Native | ❌ Community types |
| **Maintenance** | ✅ Active | ❓ Varies |

> **Performance**: TurboModule architecture provides ~2x better performance compared to legacy bridge modules.

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
# Using npm
npm install react-native-rotation-detector

# Using yarn
yarn add react-native-rotation-detector

# Using pnpm
pnpm add react-native-rotation-detector
```

> **📦 Available on NPM:** [react-native-rotation-detector](https://www.npmjs.com/package/react-native-rotation-detector)

### ✅ Verify Installation

After installation, you can verify it's working:

```javascript
import { useRotation } from 'react-native-rotation-detector';

// This should work without any build errors
console.log('Package installed successfully!');
```

Check your package.json:

```bash
# Verify the package is listed in dependencies
cat package.json | grep react-native-rotation-detector
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

### Available Hooks

This package provides two React hooks with different behaviors optimized for each platform:

#### `useRotation()` - Cross-platform immediate updates

- **iOS**: Provides immediate rotation updates using native orientation change events
- **Android**: Provides immediate rotation updates using sensor data
- **Use case**: Real-time rotation tracking, UI adjustments during rotation

#### `useRotationComplete()` - Android-only completion detection

- **Android**: Waits for rotation animation to complete before updating state
- **iOS**: Not available (iOS handles rotation completion natively)
- **Use case**: Triggering actions after rotation finishes, avoiding mid-rotation glitches

### Basic Usage - Immediate Updates

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

### Android-Only: Rotation Completion Detection

```js
import { useRotationComplete } from 'react-native-rotation-detector';
import { Platform } from 'react-native';

function MyComponent() {
  if (Platform.OS === 'android') {
    const { angle, label, isRotating } = useRotationComplete();

    return (
      <View>
        <Text>Final rotation: {angle}°</Text>
        <Text>Orientation: {label}</Text>
        <Text>Status: {isRotating ? 'Rotating...' : 'Stable'}</Text>
      </View>
    );
  }

  // For iOS, use regular useRotation
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

#### iOS Implementation

- **`useRotation()`**: Uses `DeviceEventEmitter` to listen for orientation changes via `UIDevice` notifications
- **`useRotationComplete()`**: Not available - iOS handles rotation completion natively through the system UI
- **Behavior**: iOS provides smooth, system-managed rotation animations with automatic completion handling

#### Android Implementation

- **`useRotation()`**: Uses native `OrientationEventListener` for precise rotation tracking with raw degree bucketing
- **`useRotationComplete()`**: Uses configuration change broadcasts and sensor data to detect rotation completion
- **Behavior**: Android uses sensor data which requires explicit completion detection for optimal UX
- **Transition Support**: Handles all rotation transitions including landscape-left ↔ landscape-right (180° sensor transitions)

#### Why Android-Only `useRotationComplete()`?

On **iOS**, the system automatically manages rotation animations and provides completion callbacks through the native UI system. The rotation events you receive are already "complete" in the sense that they represent the final orientation state.

On **Android**, rotation detection relies on raw sensor data (accelerometer/magnetometer). The device continuously reports rotation angles as the user rotates it, which means you get intermediate values during the rotation animation. `useRotationComplete()` solves this by waiting for the rotation to stabilize before updating your UI state.

**Use Cases:**

- **`useRotation()`**: Live rotation feedback, real-time UI adjustments
- **`useRotationComplete()` (Android)**: Post-rotation actions, avoiding layout shifts during rotation

## API Reference

### `useRotation(): UseRotationResult`

React hook that returns the current device rotation state with immediate updates.

**Platform Support:** iOS and Android

**Returns:**

```typescript
interface UseRotationResult {
  angle: RotationDeg;  // 0 | 90 | 180 | 270
  label: RotationLabel; // 'portrait' | 'landscape-left' | 'portrait-upside-down' | 'landscape-right'
}
```

### `useRotationComplete(): UseRotationCompleteResult`

React hook that waits for rotation animation completion before updating state.

**Platform Support:** Android only (logs error in development mode on other platforms)

**Returns:**

```typescript
interface UseRotationCompleteResult {
  angle: RotationDeg;    // 0 | 90 | 180 | 270
  label: RotationLabel;  // 'portrait' | 'landscape-left' | 'portrait-upside-down' | 'landscape-right'
  isRotating: boolean;   // true during rotation animation, false when stable
}
```

### Types

```typescript
export type RotationDeg = 0 | 90 | 180 | 270;
export type RotationLabel =
  | 'portrait'           // 0°
  | 'portrait-upside-down'  // 180°
  | 'landscape-left'     // 90°
  | 'landscape-right';   // 270°
```

## Troubleshooting

### Import Issues

**Problem**: Module resolution errors like `node_modules/react-native-rotation-detector/lib/typescript/src/useRotationComplete could not be found`

**Solution**: Always import from the package root, not internal paths:

```typescript
// ✅ Correct
import { useRotation, useRotationComplete } from 'react-native-rotation-detector';

// ❌ Wrong - don't import from internal paths
import { useRotationComplete } from 'node_modules/react-native-rotation-detector/lib/typescript/src/useRotationComplete';
```

**Problem**: `useRotationComplete` is not available on iOS

**Solution**: Use platform checks when using `useRotationComplete`:

```typescript
import { Platform } from 'react-native';
import { useRotation, useRotationComplete } from 'react-native-rotation-detector';

function MyComponent() {
  if (Platform.OS === 'android') {
    const { angle, label, isRotating } = useRotationComplete();
    // Android-specific logic
  } else {
    const { angle, label } = useRotation();
    // iOS and other platforms
  }
}
```

### iOS Issues

- **Build errors**: Ensure your iOS deployment target is 11.0 or higher
- **Pod installation fails**: Run `cd ios && pod install --repo-update`
- **Swift compilation errors**: Ensure Xcode 13.0+ is being used

### Android Issues

- **Build errors**: Ensure your `minSdkVersion` is 21 or higher
- **Auto-linking not working**: Try running `npx react-native unlink react-native-rotation-detector` then `npx react-native link react-native-rotation-detector`
- **Kotlin compilation errors**: Ensure Kotlin 1.7.0+ is configured in your project
- **Rotation completion not working**: Ensure your app handles configuration changes properly in `AndroidManifest.xml`

### General Issues

- **Hook not updating**: Ensure your React Native version supports TurboModules (0.68+)
- **Events not firing**: Check that your app has the necessary orientation permissions enabled
- **Package version mismatch**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

## 📋 Versioning & Releases

This project follows [Semantic Versioning (SemVer)](https://semver.org/):

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### 📈 Release Notes

- **v1.0.0**: Initial release with full TurboModule support
- View all releases on [GitHub Releases](https://github.com/andrese03/react-native-rotation-detector/releases)
- View package history on [NPM](https://www.npmjs.com/package/react-native-rotation-detector?activeTab=versions)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Support

- ⭐ **Star this repository** if you find it useful
- � **[Sponsor this project](https://github.com/sponsors/andrese03)** - Support ongoing development
- �🐛 **Report issues** on [GitHub Issues](https://github.com/andrese03/react-native-rotation-detector/issues)
- 💬 **Ask questions** in [GitHub Discussions](https://github.com/andrese03/react-native-rotation-detector/discussions)
- 📦 **View on NPM**: [react-native-rotation-detector](https://www.npmjs.com/package/react-native-rotation-detector)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
