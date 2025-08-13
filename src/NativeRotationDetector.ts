import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  // Start rotation event listener
  startRotationListener(): void;
  // Stop rotation event listener
  stopRotationListener(): void;
  // Get current rotation angle
  getCurrentRotation(): number;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RotationDetector');
