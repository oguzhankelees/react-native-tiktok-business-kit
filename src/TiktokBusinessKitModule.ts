import { NitroModules } from 'react-native-nitro-modules';
import type { TiktokBusinessKit } from './TiktokBusinessKit.nitro';
import type { TikTokEventParams } from './types';
import { serializeEventParams } from './trackEvent';
import {
	mapTrackingAuthorizationStatus,
	type TikTokTrackingAuthorizationStatus,
} from './trackingAuthorization';

const hybrid = NitroModules.createHybridObject<TiktokBusinessKit>('TiktokBusinessKit');

export default {
	initialize: hybrid.initialize.bind(hybrid),
	identify: hybrid.identify.bind(hybrid),
	logout: hybrid.logout.bind(hybrid),
	flush: hybrid.flush.bind(hybrid),
	requestTrackingAuthorization(): Promise<TikTokTrackingAuthorizationStatus> {
		return hybrid
			.requestTrackingAuthorization()
			.then((raw) => mapTrackingAuthorizationStatus(raw));
	},
	test: hybrid.test.bind(hybrid),
	trackEvent(
		event: string,
		params?: TikTokEventParams,
		eventId?: string,
	) {
		hybrid.trackEvent(event, serializeEventParams(params), eventId);
	},
	trackEventRaw(
		event: string,
		paramsJson?: string,
		eventId?: string,
	) {
		hybrid.trackEvent(event, paramsJson, eventId);
	},
};
