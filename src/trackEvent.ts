import type { TikTokEventParams } from './types';

export const serializeEventParams = (
	params?: TikTokEventParams,
): string | undefined => {
	if (!params) {
		return undefined;
	}

	const serialized: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined) {
			continue;
		}
		serialized[key] = value;
	}

	if (Object.keys(serialized).length === 0) {
		return undefined;
	}

	return JSON.stringify(serialized);
};
