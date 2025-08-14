# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2025-08-14

### Bug Fixes

- Fixed TypeScript module resolution for `useRotationComplete` hook
- Rebuilt package with proper TypeScript definitions

## [1.2.1] - 2025-08-14

### Changed

- **BREAKING**: `useRotationComplete` hook is now Android-only
- iOS implementation of `useRotationComplete` has been disabled for platform
  consistency

### Added

- Added no-op implementations for iOS rotation completion methods to maintain
  interface compatibility
- Enhanced documentation to clarify Android-only availability of
  `useRotationComplete`
- Added development-time warnings when using `useRotationComplete` on
  non-Android platforms

### Fixed

- Removed unused iOS-specific code from `useRotationComplete` hook
- Fixed TypeScript compilation errors related to platform-specific code
- Improved error handling for unsupported platforms

### Technical

- Added `startRotationCompletionListener()` and
  `stopRotationCompletionListener()` no-op methods to iOS implementation
- Simplified `useRotationComplete` hook to only handle Android platform
- Updated JSDoc comments to reflect Android-only availability

## [1.1.0] - 2024-XX-XX

### Features

- Initial release with `useRotationComplete` hook
- Cross-platform rotation detection for iOS and Android
- TurboModule architecture support

## [1.0.0] - 2024-XX-XX

### Initial Release

- Initial release with basic rotation detection
- `useRotation` hook for real-time rotation tracking
- Support for React Native 0.68+
- TypeScript definitions
- Auto-linking support
