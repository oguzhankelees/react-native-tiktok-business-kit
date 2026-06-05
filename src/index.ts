export { default } from './TiktokBusinessKitModule';
export { default as TiktokBusinessKit } from './TiktokBusinessKitModule';

export type {
	TikTokEventPropertyValue,
	TikTokIdentifyUser,
	TikTokInitializeConfig,
	TiktokBusinessKit as TiktokBusinessKitSpec,
} from './TiktokBusinessKit.nitro';

export * from './types';
export * from './events';
export {
	TikTokTrackingAuthorizationStatus,
	mapTrackingAuthorizationStatus,
} from './trackingAuthorization';
export { serializeEventParams } from './trackEvent';
