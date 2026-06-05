import { Platform } from 'react-native';
import {
	TIKTOK_ANDROID_APP_ID,
	TIKTOK_APP_ID,
	TIKTOK_APP_SECRET,
	TIKTOK_DEBUG,
	TIKTOK_IOS_APP_ID,
	TIKTOK_TEST_EMAIL,
	TIKTOK_TEST_EXTERNAL_ID,
	TIKTOK_TEST_PHONE,
	TIKTOK_TEST_USERNAME,
	TIKTOK_TT_APP_ID_IOS,
	TIKTOK_TT_APP_ID_ANDROID,
} from '@env';

const parseDebug = (value: string | undefined): boolean => {
	if (value === 'true') {
		return true;
	}
	if (value === 'false') {
		return false;
	}
	return __DEV__;
};

const resolveAppId = (): string => {
	if (Platform.OS === 'ios') {
		return TIKTOK_IOS_APP_ID ?? '';
	}
	return TIKTOK_ANDROID_APP_ID ?? TIKTOK_APP_ID ?? '';
};

export const tiktokEnv = {
	appId: resolveAppId(),
	appSecret: TIKTOK_APP_SECRET ?? '',
	ttAppId: (Platform.OS === 'ios' ? TIKTOK_TT_APP_ID_IOS : (TIKTOK_TT_APP_ID_ANDROID ?? '')) ?? '',
	debug: parseDebug(TIKTOK_DEBUG),
	testUser: {
		externalId: TIKTOK_TEST_EXTERNAL_ID ?? '',
		externalUserName: TIKTOK_TEST_USERNAME ?? undefined,
		phoneNumber: TIKTOK_TEST_PHONE ?? undefined,
		email: TIKTOK_TEST_EMAIL ?? undefined,
	},
};

export const isTiktokEnvConfigured = (): boolean => Boolean(tiktokEnv.appId?.length && tiktokEnv.appSecret?.length && tiktokEnv.ttAppId?.length);

export const isTiktokTestUserConfigured = (): boolean => Boolean(tiktokEnv.testUser.externalId?.length);
