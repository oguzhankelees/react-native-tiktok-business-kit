import { NitroModules } from 'react-native-nitro-modules';
import type { TiktokBusinessKit } from './TiktokBusinessKit.nitro';

const TiktokBusinessKitHybridObject =
  NitroModules.createHybridObject<TiktokBusinessKit>('TiktokBusinessKit');

export function multiply(a: number, b: number): number {
  return TiktokBusinessKitHybridObject.multiply(a, b);
}
