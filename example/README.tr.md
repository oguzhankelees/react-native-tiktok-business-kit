# Example

[🇬🇧 English](./README.md)

`react-native-tiktok-business-kit` paketinin npm üzerinden kurulduğu örnek uygulama. SDK başlatma, event gönderme, `identify` ve `logout` akışlarını test etmek için kullanılır.

## Kurulum

```sh
yarn install
yarn setup:env
```

`.env` dosyasını TikTok Events Manager bilgilerinizle doldurun:

```env
TIKTOK_ANDROID_APP_ID=com.example.android
TIKTOK_IOS_APP_ID=1234567890
TIKTOK_APP_SECRET=your_access_token
TIKTOK_TT_APP_ID_IOS=your_tiktok_ios_app_id
TIKTOK_TT_APP_ID_ANDROID=your_tiktok_android_app_id
TIKTOK_DEBUG=true
TIKTOK_TEST_EXTERNAL_ID=user_123
TIKTOK_TEST_USERNAME=demo_user
TIKTOK_TEST_PHONE=+905555555555
TIKTOK_TEST_EMAIL=demo@example.com
```

iOS için:

```sh
cd ios && pod install && cd ..
```

## Çalıştırma

```sh
yarn start
```

Ayrı bir terminalde:

```sh
yarn ios
# veya
yarn android
```

## Uygulama ne yapar?

`App.tsx` açıldığında SDK'yı `.env` değerleriyle başlatır. Ekrandaki butonlar:

| Buton | İşlem |
|-------|-------|
| ViewContent event gönder | `TikTokEvent.VIEW_CONTENT` + `contents` parametreleri, ardından `flush` |
| Identify | `.env` içindeki test kullanıcısıyla `identify` |
| Logout | `logout` |

### Örnek kod

SDK başlatma (`App.tsx`):

```ts
import TiktokBusinessKit from 'react-native-tiktok-business-kit';

await TiktokBusinessKit.initialize({
  appId: tiktokEnv.appId,
  appSecret: tiktokEnv.appSecret,
  ttAppId: tiktokEnv.ttAppId,
  debug: tiktokEnv.debug,
});
```

Event gönderme:

```ts
import TiktokBusinessKit, { TikTokEvent } from 'react-native-tiktok-business-kit';

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
```

Platforma göre `appId` seçimi `tiktokEnv.ts` içinde yapılır:

- **iOS:** `TIKTOK_IOS_APP_ID` (sayısal App Store ID)
- **Android:** `TIKTOK_ANDROID_APP_ID` (paket adı)

## iOS notları

- `Info.plist` içinde `NSUserTrackingUsageDescription` tanımlıdır
- `pod install` hata verirse `ios/Podfile` içine `pod 'TikTokBusinessSDK', :modular_headers => true` ekleyin (opsiyonel)
