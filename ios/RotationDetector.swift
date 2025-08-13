import Foundation
import UIKit
import React

/**
 * Swift implementation of the RotationDetector turbo module
 * 
 * This module provides cross-platform rotation detection capabilities,
 * emitting precise rotation angles (0°, 90°, 180°, 270°) and orientation labels.
 */
@objc(RotationDetector)
class RotationDetector: RCTEventEmitter {
    
    // MARK: - Properties
    
    /// Tracks if there are active listeners to optimize performance
    private var hasListeners = false
    
    /// Notification observer token for cleanup
    private var orientationObserver: NSObjectProtocol?
    
    // MARK: - RCTEventEmitter Overrides
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    override func supportedEvents() -> [String]! {
        return ["namedOrientationDidChange"]
    }
    
    @objc
    override func startObserving() {
        hasListeners = true
        setupOrientationListener()
    }
    
    @objc
    override func stopObserving() {
        hasListeners = false
        removeOrientationListener()
    }
    
    // MARK: - Private Methods
    
    /**
     * Sets up the device orientation change listener
     */
    private func setupOrientationListener() {
        // Enable device orientation notifications
        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
        
        // Add observer for orientation changes
        orientationObserver = NotificationCenter.default.addObserver(
            forName: UIDevice.orientationDidChangeNotification,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            self?.handleOrientationChange()
        }
    }
    
    /**
     * Removes the device orientation change listener
     */
    private func removeOrientationListener() {
        // Remove observer
        if let observer = orientationObserver {
            NotificationCenter.default.removeObserver(observer)
            orientationObserver = nil
        }
        
        // Disable device orientation notifications
        UIDevice.current.endGeneratingDeviceOrientationNotifications()
    }
    
    /**
     * Handles device orientation changes and emits events with orientation name
     */
    private func handleOrientationChange() {
        guard hasListeners else {
            return // No listeners, don't emit
        }
        
        let orientation = UIDevice.current.orientation
        
        if let orientationName = orientationToString(orientation) {
            sendEvent(withName: "namedOrientationDidChange", body: ["name": orientationName])
        }
    }
    
    /**
     * Converts UIDeviceOrientation to string representation
     * 
     * - Parameter orientation: The device orientation to convert
     * - Returns: String representation of the orientation, or nil for unsupported orientations
     */
    private func orientationToString(_ orientation: UIDeviceOrientation) -> String? {
        switch orientation {
        case .portrait:
            return "UIDeviceOrientationPortrait"
        case .portraitUpsideDown:
            return "UIDeviceOrientationPortraitUpsideDown"
        case .landscapeLeft:
            return "UIDeviceOrientationLandscapeLeft"
        case .landscapeRight:
            return "UIDeviceOrientationLandscapeRight"
        default:
            return nil // Unknown, FaceUp, FaceDown orientations
        }
    }
    
    /**
     * Converts UIDeviceOrientation to rotation angle in degrees
     * 
     * - Parameter orientation: The device orientation to convert
     * - Returns: Rotation angle in degrees (0, 90, 180, 270)
     */
    private func orientationToAngle(_ orientation: UIDeviceOrientation) -> NSNumber {
        switch orientation {
        case .portrait:
            return 0
        case .landscapeLeft:
            return 90
        case .portraitUpsideDown:
            return 180
        case .landscapeRight:
            return 270
        default:
            return 0 // Default to portrait for unknown orientations
        }
    }
    
    // MARK: - Turbo Module Methods
    
    /**
     * Starts rotation listener - for iOS this is handled automatically by RCTEventEmitter
     * 
     * The actual listening starts when JavaScript adds the first listener via startObserving()
     */
    @objc
    func startRotationListener() {
        // For iOS, the listener is managed by the RCTEventEmitter lifecycle
        // The actual listening starts when JS adds the first listener
    }
    
    /**
     * Stops rotation listener - for iOS this is handled automatically by RCTEventEmitter
     * 
     * The actual listening stops when JavaScript removes the last listener via stopObserving()
     */
    @objc
    func stopRotationListener() {
        // For iOS, the listener is managed by the RCTEventEmitter lifecycle
        // The actual listening stops when JS removes the last listener
    }
    
    /**
     * Gets the current device rotation angle in degrees (asynchronous version)
     * 
     * - Parameters:
     *   - resolve: Promise resolve callback
     *   - reject: Promise reject callback
     */
    @objc
    func getCurrentRotation(_ resolve: @escaping RCTPromiseResolveBlock, 
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
        let orientation = UIDevice.current.orientation
        let angle = orientationToAngle(orientation)
        resolve(angle)
    }
    
    /**
     * Gets the current device rotation angle in degrees (synchronous version for Turbo Modules)
     * 
     * - Returns: Current rotation angle as NSNumber
     */
    @objc
    func getCurrentRotation() -> NSNumber {
        let orientation = UIDevice.current.orientation
        return orientationToAngle(orientation)
    }
    
    // MARK: - Cleanup
    
    deinit {
        removeOrientationListener()
    }
}
