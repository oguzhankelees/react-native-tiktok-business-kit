export type TikTokBusinessConfig = {
	appId: string;
	appSecret: string;
	ttAppId: string;
	debug?: boolean;
};
  
export type TikTokContentItem = {
	content_id: string;
	content_type?: string;
	content_name?: string;
	currency?: string;
	price?: number;
	quantity?: number;
	brand?: string;
};

export type TikTokEventParams = Record<
	string,
	string | number | boolean | TikTokContentItem[] | undefined
>;
  
export type { TikTokIdentifyUser as TikTokUser } from './TiktokBusinessKit.nitro';