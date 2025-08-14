package com.rotationdetector

import android.content.Context
import android.content.res.Configuration
import android.hardware.SensorManager
import android.view.OrientationEventListener
import android.view.Surface
import android.view.WindowManager
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.LifecycleEventListener

@ReactModule(name = RotationDetectorModule.NAME)
class RotationDetectorModule(reactContext: ReactApplicationContext) :
  NativeRotationDetectorSpec(reactContext), LifecycleEventListener {

  private var orientationEventListener: OrientationEventListener? = null
  private var currentRotation: Int = 0
  private var lastKnownOrientation: Int = Configuration.ORIENTATION_UNDEFINED
  private var lastKnownRotation: Int = -1
  private var isListeningForCompletion: Boolean = false
  private var completionHandler: Handler = Handler(Looper.getMainLooper())
  private var completionRunnable: Runnable? = null
  private var stabilityCheckRunnable: Runnable? = null
  private var rotationCheckRunnable: Runnable? = null

  init {
    reactContext.addLifecycleEventListener(this)
  }

  override fun getName(): String {
    return NAME
  }

  /**
   * Starts listening for device rotation changes using OrientationEventListener.
   * Emits 'rotationChanged' events with precise rotation degrees.
   */
  override fun startRotationListener() {
    if (orientationEventListener != null) {
      return // Already listening
    }

    val context = reactApplicationContext
    orientationEventListener = object : OrientationEventListener(context, SensorManager.SENSOR_DELAY_NORMAL) {
      override fun onOrientationChanged(orientation: Int) {
        if (orientation == ORIENTATION_UNKNOWN) {
          return
        }

        // Update current rotation
        currentRotation = orientation

        // Create event data
        val params: WritableMap = Arguments.createMap()
        params.putInt("degrees", orientation)

        // Emit the rotation change event
        sendEvent("rotationChanged", params)
      }
    }

    // Enable the listener if sensor is available
    if (orientationEventListener!!.canDetectOrientation()) {
      orientationEventListener!!.enable()
    }
  }

  /**
   * Stops listening for device rotation changes and cleans up resources.
   */
  override fun stopRotationListener() {
    orientationEventListener?.let { listener ->
      listener.disable()
      orientationEventListener = null
    }
  }

  /**
   * Starts listening for rotation completion using polling mechanism.
   * This detects when the screen rotation animation finishes.
   */
  override fun startRotationCompletionListener() {
    isListeningForCompletion = true
    // Get initial orientation and rotation
    lastKnownOrientation = reactApplicationContext.resources.configuration.orientation
    lastKnownRotation = getScreenRotationDegrees()

    // Start polling for rotation changes
    startRotationPolling()
  }

  /**
   * Stops listening for rotation completion.
   */
  override fun stopRotationCompletionListener() {
    isListeningForCompletion = false
    completionRunnable?.let { runnable ->
      completionHandler.removeCallbacks(runnable)
      completionRunnable = null
    }
    stabilityCheckRunnable?.let { runnable ->
      completionHandler.removeCallbacks(runnable)
      stabilityCheckRunnable = null
    }
    rotationCheckRunnable?.let { runnable ->
      completionHandler.removeCallbacks(runnable)
      rotationCheckRunnable = null
    }
  }

  /**
   * Starts polling to detect rotation changes
   */
  private fun startRotationPolling() {
    if (!isListeningForCompletion) {
      return
    }

    rotationCheckRunnable = Runnable {
      checkForRotationChange()
      if (isListeningForCompletion) {
        // Poll every 50ms for smooth detection
        completionHandler.postDelayed(rotationCheckRunnable!!, 50)
      }
    }

    completionHandler.post(rotationCheckRunnable!!)
  }

  /**
   * Checks for rotation changes and triggers completion detection
   */
  private fun checkForRotationChange() {
    val currentOrientation = reactApplicationContext.resources.configuration.orientation
    val currentRotationDegrees = getScreenRotationDegrees()

    // Check if either orientation or rotation degrees changed
    if ((currentOrientation != lastKnownOrientation &&
         currentOrientation != Configuration.ORIENTATION_UNDEFINED) ||
        (currentRotationDegrees != lastKnownRotation)) {

      lastKnownOrientation = currentOrientation
      lastKnownRotation = currentRotationDegrees

      // Cancel any pending callbacks
      completionRunnable?.let { runnable ->
        completionHandler.removeCallbacks(runnable)
      }
      stabilityCheckRunnable?.let { runnable ->
        completionHandler.removeCallbacks(runnable)
      }

      // Primary completion check
      completionRunnable = Runnable {
        emitRotationCompleted()
        completionRunnable = null
      }

      // Secondary stability check as fallback
      stabilityCheckRunnable = Runnable {
        // Double-check if rotation is stable
        val finalRotation = getScreenRotationDegrees()
        if (finalRotation == currentRotationDegrees) {
          emitRotationCompleted()
        }
        stabilityCheckRunnable = null
      }

      // Post primary callback with optimal delay (300ms)
      completionHandler.postDelayed(completionRunnable!!, 300)
      // Post fallback callback with longer delay (600ms)
      completionHandler.postDelayed(stabilityCheckRunnable!!, 600)
    }
  }

  /**
   * Gets the current device rotation angle in degrees.
   * @return Current rotation angle (0-360 degrees)
   */
  override fun getCurrentRotation(): Double {
    return getScreenRotationDegrees().toDouble()
  }

  /**
   * Gets the actual screen rotation in degrees based on Surface rotation.
   */
  private fun getScreenRotationDegrees(): Int {
    val windowManager = reactApplicationContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    val rotation = windowManager.defaultDisplay.rotation

    return when (rotation) {
      Surface.ROTATION_0 -> 0
      Surface.ROTATION_90 -> 90
      Surface.ROTATION_180 -> 180
      Surface.ROTATION_270 -> 270
      else -> 0
    }
  }

  /**
   * Emits the rotation completed event
   */
  private fun emitRotationCompleted() {
    val rotationDegrees = getScreenRotationDegrees()

    // Create event data
    val params: WritableMap = Arguments.createMap()
    params.putInt("degrees", rotationDegrees)

    // Emit the rotation completion event
    sendEvent("rotationCompleted", params)
  }

  /**
   * Helper method to send events to JavaScript
   */
  private fun sendEvent(eventName: String, params: WritableMap?) {
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  // LifecycleEventListener methods
  override fun onHostResume() {
    // Nothing to do
  }

  override fun onHostPause() {
    // Nothing to do
  }

  override fun onHostDestroy() {
    stopRotationListener()
    stopRotationCompletionListener()
    reactApplicationContext.removeLifecycleEventListener(this)
  }

  companion object {
    const val NAME = "RotationDetector"
  }
}
