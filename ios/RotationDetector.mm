#import "RotationDetector.h"
#import <React/RCTEventEmitter.h>

@interface RotationDetector ()
@property (nonatomic, assign) BOOL hasListeners;
@end

@implementation RotationDetector

RCT_EXPORT_MODULE()

// Base class must be RCTEventEmitter to support event emission
+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

// Array of supported events for RCTEventEmitter
- (NSArray<NSString *> *)supportedEvents
{
    return @[@"namedOrientationDidChange"];
}

// Called when this module's first listener is added
-(void)startObserving {
    self.hasListeners = YES;
    // Start listening to device orientation changes
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(orientationDidChange:)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil];
    
    // Enable device orientation notifications
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
}

// Called when this module's last listener is removed, or on dealloc
-(void)stopObserving {
    self.hasListeners = NO;
    // Stop listening to device orientation changes
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                     name:UIDeviceOrientationDidChangeNotification
                                                   object:nil];
    
    // Disable device orientation notifications
    [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
}

/**
 * Handles device orientation changes and emits events with orientation name
 */
- (void)orientationDidChange:(NSNotification *)notification
{
    if (!self.hasListeners) {
        return; // No listeners, don't emit
    }
    
    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    NSString *orientationName = [self orientationToString:orientation];
    
    if (orientationName) {
        [self sendEventWithName:@"namedOrientationDidChange" 
                           body:@{@"name": orientationName}];
    }
}

/**
 * Converts UIDeviceOrientation to string representation
 */
- (NSString *)orientationToString:(UIDeviceOrientation)orientation
{
    switch (orientation) {
        case UIDeviceOrientationPortrait:
            return @"UIDeviceOrientationPortrait";
        case UIDeviceOrientationPortraitUpsideDown:
            return @"UIDeviceOrientationPortraitUpsideDown";
        case UIDeviceOrientationLandscapeLeft:
            return @"UIDeviceOrientationLandscapeLeft";
        case UIDeviceOrientationLandscapeRight:
            return @"UIDeviceOrientationLandscapeRight";
        default:
            return nil; // Unknown, FaceUp, FaceDown orientations
    }
}

/**
 * Converts UIDeviceOrientation to rotation angle in degrees
 */
- (NSNumber *)orientationToAngle:(UIDeviceOrientation)orientation
{
    switch (orientation) {
        case UIDeviceOrientationPortrait:
            return @(0);
        case UIDeviceOrientationLandscapeLeft:
            return @(90);
        case UIDeviceOrientationPortraitUpsideDown:
            return @(180);
        case UIDeviceOrientationLandscapeRight:
            return @(270);
        default:
            return @(0); // Default to portrait for unknown orientations
    }
}

// Turbo Module methods

/**
 * Starts rotation listener - for iOS this is handled automatically by RCTEventEmitter
 */
RCT_EXPORT_METHOD(startRotationListener)
{
    // For iOS, the listener is managed by the RCTEventEmitter lifecycle
    // The actual listening starts when JS adds the first listener
}

/**
 * Stops rotation listener - for iOS this is handled automatically by RCTEventEmitter
 */
RCT_EXPORT_METHOD(stopRotationListener)
{
    // For iOS, the listener is managed by the RCTEventEmitter lifecycle
    // The actual listening stops when JS removes the last listener
}

/**
 * Gets the current device rotation angle in degrees
 */
RCT_EXPORT_METHOD(getCurrentRotation:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    NSNumber *angle = [self orientationToAngle:orientation];
    resolve(angle);
}

// Synchronous version for turbo modules
- (NSNumber *)getCurrentRotation
{
    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    return [self orientationToAngle:orientation];
}

// Legacy method - keeping for backward compatibility
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);
    return result;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRotationDetectorSpecJSI>(params);
}

@end
