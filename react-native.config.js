module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: '../android',
        packageImportPath:
          'import com.rotationdetector.RotationDetectorPackage;',
      },
      ios: {
        // iOS auto-linking is handled by CocoaPods through the podspec
      },
    },
  },
};
