export enum TikTokTrackingAuthorizationStatus {
	NotDetermined = 'notDetermined',
	Restricted = 'restricted',
	Denied = 'denied',
	Authorized = 'authorized',
	Unavailable = 'unavailable',
}

const trackingStatusByCode: Record<number, TikTokTrackingAuthorizationStatus> = {
	0: TikTokTrackingAuthorizationStatus.NotDetermined,
	1: TikTokTrackingAuthorizationStatus.Restricted,
	2: TikTokTrackingAuthorizationStatus.Denied,
	3: TikTokTrackingAuthorizationStatus.Authorized,
	[-1]: TikTokTrackingAuthorizationStatus.Unavailable,
};

export const mapTrackingAuthorizationStatus = (
	raw: number,
): TikTokTrackingAuthorizationStatus =>
	trackingStatusByCode[raw] ?? TikTokTrackingAuthorizationStatus.Unavailable;
