package com.rotationdetector

import android.content.Context
import android.hardware.SensorManager
import android.view.OrientationEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RotationDetectorModule.NAME)
class RotationDetectorModule(reactContext: ReactApplicationContext) :
  NativeRotationDetectorSpec(reactContext) {

  private var orientationEventListener: OrientationEventListener? = null
  private var currentRotation: Int = 0

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
   * Gets the current device rotation angle in degrees.
   * @return Current rotation angle (0-360 degrees)
   */
  override fun getCurrentRotation(): Double {
    return currentRotation.toDouble()
  }

  /**
   * Helper method to send events to JavaScript
   */
  private fun sendEvent(eventName: String, params: WritableMap?) {
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  // Example method - keeping for backward compatibility
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = "RotationDetector"
  }
}
