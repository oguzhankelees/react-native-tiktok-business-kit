# react-native-tiktok-business-kit

[🇬🇧 English documentation](./README.md)

TikTok Business SDK için React Native Nitro modülü. Tek bir TypeScript API ile event takibi, kullanıcı tanımlama (`identify`), logout ve flush işlemlerini Android ve iOS üzerinde yönetmenizi sağlar.

- **Android SDK:** `1.6.1` ([entegrasyon dokümanı](https://business-api.tiktok.com/portal/docs/android-integration-steps/v1.3))
- **iOS SDK:** `1.6.1` ([entegrasyon dokümanı](https://business-api.tiktok.com/portal/docs/ios-integration-steps/v1.3))
- **Altyapı:** [Nitro Modules](https://nitro.margelo.com/)

## Gereksinimler

- React Native `>= 0.75`
- [react-native-nitro-modules](https://github.com/mrousavy/nitro) `^0.35.9`
- TikTok Events Manager hesabı ve uygulama kimlik bilgileri

## Kurulum

```sh
yarn add react-native-tiktok-business-kit react-native-nitro-modules
```

```sh
cd ios && pod install && cd ..
```

### iOS — Podfile (opsiyonel)

Bazı projelerde `pod install` şu hatayı verebilir:

> The Swift pod `TiktokBusinessKit` depends upon `TikTokBusinessSDK`, which does not define modules.

Bu durumda `ios/Podfile` içine ekleyin:

```ruby
pod 'TikTokBusinessSDK', :modular_headers => true
```

Birçok projede bu satır **gerekmeden** de çalışır; yalnızca hata alırsanız ekleyin. Global `use_modular_headers!` kullanmayın.

### iOS — App Tracking Transparency (ATT)

`Info.plist` dosyanıza açıklama ekleyin:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>Reklam ölçümü için cihaz tanımlayıcısı kullanılır.</string>
```

### Android

Ek Gradle yapılandırması gerekmez. SDK JitPack üzerinden otomatik çekilir.

## Kimlik bilgileri

TikTok Events Manager'dan alınan değerler:

| Alan | Açıklama |
|------|----------|
| `appSecret` | Access token / app secret |
| `ttAppId` | TikTok App ID (sayısal) |
| `appId` | **Platforma göre değişir** (aşağıya bakın) |

### `appId` platform farkı

| Platform | Format | Örnek |
|----------|--------|-------|
| **Android** | Paket adı | `com.example.app` |
| **iOS** | Sayısal App Store ID | `1234567890` |

iOS'ta Android paket adı (`com.example.app`) geçersizdir ve `Invalid appId or tiktokAppId` hatasına neden olur.

## Kullanım

### SDK başlatma

```ts
import TiktokBusinessKit from 'react-native-tiktok-business-kit';

await TiktokBusinessKit.initialize({
  appId: Platform.OS === 'ios' ? '1234567890' : 'com.example.app',
  appSecret: 'your_access_token',
  ttAppId: '7234778090113695745',
  debug: __DEV__,
});
```

### ATT izni (iOS)

```ts
import TiktokBusinessKit, {
  TikTokTrackingAuthorizationStatus,
} from 'react-native-tiktok-business-kit';

const status = await TiktokBusinessKit.requestTrackingAuthorization();

if (status === TikTokTrackingAuthorizationStatus.Authorized) {
  // IDFA takibi izni verildi
}
```

Dönen değerler (`TikTokTrackingAuthorizationStatus`):

| Enum | Anlam |
|------|-------|
| `notDetermined` | Henüz sorulmadı |
| `restricted` | Kısıtlı |
| `denied` | Reddedildi |
| `authorized` | İzin verildi |
| `unavailable` | Android (ATT yok) |

### Event gönderme

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

Desteklenen standart event sabitleri `TikTokEvent` enum'unda tanımlıdır. Özel event adı da string olarak geçirilebilir.

### Kullanıcı tanımlama

```ts
TiktokBusinessKit.identify({
  externalId: 'user_123',
  externalUserName: 'demo_user',
  phoneNumber: '+905555555555',
  email: 'user@example.com',
});
```

### Logout ve flush

```ts
TiktokBusinessKit.logout();
TiktokBusinessKit.flush();
```

### Ham JSON ile event (gelişmiş)

```ts
TiktokBusinessKit.trackEventRaw('ViewContent', JSON.stringify({ content_type: 'product' }));
```

## API özeti

| Metod | Açıklama |
|-------|----------|
| `initialize(config)` | SDK'yı başlatır (`Promise<void>`) |
| `requestTrackingAuthorization()` | ATT izin diyaloğu (iOS), `Promise<TikTokTrackingAuthorizationStatus>` |
| `trackEvent(event, params?, eventId?)` | Event gönderir |
| `trackEventRaw(event, paramsJson?, eventId?)` | Ham JSON string ile event gönderir |
| `identify(user)` | Kullanıcıyı tanımlar |
| `logout()` | Oturumu kapatır |
| `flush()` | Bekleyen event'leri gönderir |

### Tipler

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

## Events Manager notları

- TikTok Events Manager yalnızca [desteklenen parametreleri](https://business-api.tiktok.com/portal/docs) gösterir (`content_type`, `currency`, `value`, `contents` vb.).
- Özel anahtarlar SDK tarafından normalize edilir veya yok sayılır.
- E-ticaret event'leri için `contents` dizisi kullanın.

## Test

Paketi denemek için repodaki `example` uygulamasını kullanabilirsiniz. Kurulum adımları için [example/README.tr.md](example/README.tr.md) dosyasına bakın.
