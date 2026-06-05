# Example

[🇹🇷 Türkçe](./README.tr.md)

Sample app that installs `react-native-tiktok-business-kit` from npm. Use it to test SDK initialization, event tracking, `identify`, and `logout`.

## Setup

```sh
yarn install
yarn setup:env
```

Fill in `.env` with your TikTok Events Manager credentials:

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

For iOS:

```sh
cd ios && pod install && cd ..
```

## Run

```sh
yarn start
```

In a separate terminal:

```sh
yarn ios
# or
yarn android
```

## What the app does

`App.tsx` initializes the SDK from `.env` on launch. Screen buttons:

| Button | Action |
|--------|--------|
| ViewContent event gönder | `TikTokEvent.VIEW_CONTENT` with `contents`, then `flush` |
| Identify | `identify` with the test user from `.env` |
| Logout | `logout` |

### Sample code

SDK initialization (`App.tsx`):

```ts
import TiktokBusinessKit from 'react-native-tiktok-business-kit';

await TiktokBusinessKit.initialize({
  appId: tiktokEnv.appId,
  appSecret: tiktokEnv.appSecret,
  ttAppId: tiktokEnv.ttAppId,
  debug: tiktokEnv.debug,
});
```

Event tracking:

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

Platform-specific `appId` is resolved in `tiktokEnv.ts`:

- **iOS:** `TIKTOK_IOS_APP_ID` (numeric App Store ID)
- **Android:** `TIKTOK_ANDROID_APP_ID` (package name)

## iOS notes

- `NSUserTrackingUsageDescription` is set in `Info.plist`
- If `pod install` fails, add `pod 'TikTokBusinessSDK', :modular_headers => true` to `ios/Podfile` (optional)
