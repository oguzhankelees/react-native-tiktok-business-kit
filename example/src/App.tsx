import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import TiktokBusinessKit, { TikTokEvent } from 'react-native-tiktok-business-kit';
import { isTiktokEnvConfigured, isTiktokTestUserConfigured, tiktokEnv } from './tiktokEnv';

export default function App() {
	const [status, setStatus] = useState('Başlatılmadı');

	useEffect(() => {
		if (!isTiktokEnvConfigured()) {
			setStatus('.env eksik: iOS için TIKTOK_IOS_APP_ID (sayısal App Store ID), Android için TIKTOK_ANDROID_APP_ID');
			return;
		}

		TiktokBusinessKit.initialize({
			appId: tiktokEnv.appId,
			appSecret: tiktokEnv.appSecret,
			ttAppId: tiktokEnv.ttAppId,
			debug: tiktokEnv.debug,
		})
			.then(() => setStatus('SDK hazır'))
			.catch((error: Error) => setStatus(error?.message ?? 'SDK hata'));
	}, []);

	const sendTestEvent = () => {
		TiktokBusinessKit.trackEvent(TikTokEvent.VIEW_CONTENT, {
			content_type: 'product',
			currency: 'USD',
			value: 9.99,
			contents: [
				{
					content_id: 'sku_123',
					content_type: 'product',
					currency: 'USD',
					price: 9.99,
					quantity: 1,
				},
			],
		});
		TiktokBusinessKit.flush();
		setStatus('ViewContent gönderildi (contents formatı)');
	};

	const handleIdentify = () => {
		if (!isTiktokTestUserConfigured()) {
			setStatus('TIKTOK_TEST_EXTERNAL_ID .env içinde tanımlı değil');
			return;
		}

		TiktokBusinessKit.identify({
			externalId: tiktokEnv.testUser.externalId,
			externalUserName: tiktokEnv.testUser.externalUserName,
			phoneNumber: tiktokEnv.testUser.phoneNumber,
			email: tiktokEnv.testUser.email,
		});
		setStatus('Kullanıcı identify edildi');
	};

	const handleLogout = () => {
		TiktokBusinessKit.logout();
		setStatus('Logout tamamlandı');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.status}>Durum: {status}</Text>
			<Pressable style={styles.button} onPress={sendTestEvent}>
				<Text style={styles.buttonText}>ViewContent event gönder</Text>
			</Pressable>
			<Pressable style={[styles.button, styles.secondaryButton]} onPress={handleIdentify}>
				<Text style={styles.buttonText}>Identify</Text>
			</Pressable>
			<Pressable style={[styles.button, styles.secondaryButton]} onPress={handleLogout}>
				<Text style={styles.buttonText}>Logout</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16,
		padding: 24,
	},
	status: {
		textAlign: 'center',
	},
	button: {
		backgroundColor: '#fe2c55',
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		minWidth: 220,
		alignItems: 'center',
	},
	secondaryButton: {
		backgroundColor: '#161823',
	},
	buttonText: {
		color: '#fff',
		fontWeight: '600',
	},
});
