import type { HybridObject } from 'react-native-nitro-modules';

export interface TikTokInitializeConfig {
	appId: string;
	appSecret: string;
	ttAppId: string;
	debug?: boolean;
}

export interface TikTokIdentifyUser {
	externalId: string;
	externalUserName?: string;
	phoneNumber?: string;
	email?: string;
}

export type TikTokEventPropertyValue = string | number | boolean;

export interface TiktokBusinessKit extends HybridObject<{
	ios: 'swift';
	android: 'kotlin';
}> {
	initialize(config: TikTokInitializeConfig): Promise<void>;
	trackEvent(event: string, paramsJson?: string, eventId?: string): void;
	identify(user: TikTokIdentifyUser): void;
	logout(): void;
	flush(): void;
	requestTrackingAuthorization(): Promise<number>;
	test(a: string): void;
}
