# react-native-tiktok-business-kit

[🇹🇷 Türkçe dokümantasyon](./README.tr.md)

A React Native Nitro module for the TikTok Business SDK. Track events, identify users, logout, and flush through a single TypeScript API on Android and iOS.

- **Android SDK:** `1.6.1` ([integration guide](https://business-api.tiktok.com/portal/docs/android-integration-steps/v1.3))
- **iOS SDK:** `1.6.1` ([integration guide](https://business-api.tiktok.com/portal/docs/ios-integration-steps/v1.3))
- **Runtime:** [Nitro Modules](https://nitro.margelo.com/)

## Requirements

- React Native `>= 0.75`
- [react-native-nitro-modules](https://github.com/mrousavy/nitro) `^0.35.9`
- TikTok Events Manager account and app credentials

## Installation

```sh
yarn add react-native-tiktok-business-kit react-native-nitro-modules
```

```sh
cd ios && pod install && cd ..
```

### iOS — Podfile (optional)

Some projects may fail `pod install` with:

> The Swift pod `TiktokBusinessKit` depends upon `TikTokBusinessSDK`, which does not define modules.

If that happens, add this to your `ios/Podfile`:

```ruby
pod 'TikTokBusinessSDK', :modular_headers => true
```

Many projects work **without** this line — only add it when you hit the error. Avoid global `use_modular_headers!`.

### iOS — App Tracking Transparency (ATT)

Add a usage description to `Info.plist`:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This identifier will be used to deliver personalized ads to you.</string>
```

### Android

No extra Gradle setup required. The SDK is pulled from JitPack automatically.

## Credentials

Values from TikTok Events Manager:

| Field | Description |
|-------|-------------|
| `appSecret` | Access token / app secret |
| `ttAppId` | TikTok App ID (numeric) |
| `appId` | **Platform-specific** (see below) |

### `appId` per platform

| Platform | Format | Example |
|----------|--------|---------|
| **Android** | Package name | `com.example.app` |
| **iOS** | Numeric App Store ID | `1234567890` |

Using an Android package name on iOS causes `Invalid appId or tiktokAppId`.

## Usage

### Initialize the SDK

```ts
import TiktokBusinessKit from 'react-native-tiktok-business-kit';

await TiktokBusinessKit.initialize({
  appId: Platform.OS === 'ios' ? '1234567890' : 'com.example.app',
  appSecret: 'your_access_token',
  ttAppId: '7234778090113695745',
  debug: __DEV__,
});
```

### ATT permission (iOS)

```ts
import TiktokBusinessKit, {
  TikTokTrackingAuthorizationStatus,
} from 'react-native-tiktok-business-kit';

const status = await TiktokBusinessKit.requestTrackingAuthorization();

if (status === TikTokTrackingAuthorizationStatus.Authorized) {
  // IDFA tracking allowed
}
```

Return values (`TikTokTrackingAuthorizationStatus`):

| Enum | Meaning |
|------|---------|
| `notDetermined` | Not asked yet |
| `restricted` | Restricted |
| `denied` | Denied |
| `authorized` | Authorized |
| `unavailable` | Android (no ATT) |

### Track events

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

Standard events are available via the `TikTokEvent` enum. Custom event names can be passed as strings.

### Identify users

```ts
TiktokBusinessKit.identify({
  externalId: 'user_123',
  externalUserName: 'demo_user',
  phoneNumber: '+905555555555',
  email: 'user@example.com',
});
```

### Logout and flush

```ts
TiktokBusinessKit.logout();
TiktokBusinessKit.flush();
```

### Raw JSON events (advanced)

```ts
TiktokBusinessKit.trackEventRaw('ViewContent', JSON.stringify({ content_type: 'product' }));
```

## API reference

| Method | Description |
|--------|-------------|
| `initialize(config)` | Initialize the SDK (`Promise<void>`) |
| `requestTrackingAuthorization()` | ATT prompt on iOS (`Promise<TikTokTrackingAuthorizationStatus>`) |
| `trackEvent(event, params?, eventId?)` | Track an event |
| `trackEventRaw(event, paramsJson?, eventId?)` | Track with a raw JSON string |
| `identify(user)` | Identify a user |
| `logout()` | Log out the user |
| `flush()` | Flush pending events |

### Types

```ts
type TikTokInitializeConfig = {
  appId: string;
  appSecret: string;
  ttAppId: string;
  debug?: boolean;
};

type TikTokIdentifyUser = {
  externalId: string;
  externalUserName?: string;
  phoneNumber?: string;
  email?: string;
};
```

## Events Manager notes

- TikTok Events Manager only displays [supported parameters](https://business-api.tiktok.com/portal/docs) (`content_type`, `currency`, `value`, `contents`, etc.).
- Custom keys may be normalized or ignored by the SDK.
- Use a `contents` array for e-commerce events.

## Try it

Use the `example` app in this repo to test the package. See [example/README.md](example/README.md) for setup steps.
