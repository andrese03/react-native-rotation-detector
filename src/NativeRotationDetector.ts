import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Start rotation event listener
  startRotationListener(): void;
  // Stop rotation event listener
  stopRotationListener(): void;
  // Start rotation completion listener
  startRotationCompletionListener(): void;
  // Stop rotation completion listener
  stopRotationCompletionListener(): void;
  // Get current rotation angle
  getCurrentRotation(): number;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RotationDetector');
