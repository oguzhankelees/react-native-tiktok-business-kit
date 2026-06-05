#import "TiktokBusinessKitBridge.h"

#import "TikTokBaseEvent.h"
#import "TikTokBusiness.h"
#import "TikTokConfig.h"

@implementation TiktokBusinessKitBridge

+ (void)initializeWithAccessToken:(NSString *)accessToken
                            appId:(NSString *)appId
                      tiktokAppId:(NSString *)tiktokAppId
                            debug:(BOOL)debug
                completionHandler:(void (^)(NSError *_Nullable error))completionHandler
{
  TikTokConfig *ttConfig =
      [TikTokConfig configWithAccessToken:accessToken appId:appId tiktokAppId:tiktokAppId];

  if (ttConfig == nil) {
    NSDictionary *userInfo = @{
      NSLocalizedDescriptionKey : @"Invalid TikTok SDK configuration",
    };
    NSError *error =
        [NSError errorWithDomain:@"TiktokBusinessKit" code:1 userInfo:userInfo];
    completionHandler(error);
    return;
  }

  if (ttConfig.appId.length == 0 || ttConfig.tiktokAppId.length == 0) {
    NSDictionary *userInfo = @{
      NSLocalizedDescriptionKey :
          @"iOS appId yalnızca sayısal App Store ID olmalıdır (ör. 1234567890). "
          @"Android paket adı (com.example.app) iOS'ta geçersizdir.",
    };
    NSError *error =
        [NSError errorWithDomain:@"TiktokBusinessKit" code:3 userInfo:userInfo];
    completionHandler(error);
    return;
  }

  if (debug) {
    [ttConfig enableDebugMode];
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    [TikTokBusiness initializeSdk:ttConfig
                completionHandler:^(BOOL success, NSError *_Nullable error) {
                  if (success) {
                    completionHandler(nil);
                    return;
                  }

                  if (error != nil) {
                    completionHandler(error);
                    return;
                  }

                  NSDictionary *userInfo = @{
                    NSLocalizedDescriptionKey :
                        @"TikTok Business SDK initialization failed",
                  };
                  NSError *fallbackError = [NSError errorWithDomain:@"TiktokBusinessKit"
                                                               code:2
                                                           userInfo:userInfo];
                  completionHandler(fallbackError);
                }];
  });
}

+ (void)trackEventWithName:(NSString *)eventName
                properties:(NSDictionary *)properties
                   eventId:(NSString *_Nullable)eventId
{
  TikTokBaseEvent *baseEvent;
  if (eventId.length > 0) {
    baseEvent = [[TikTokBaseEvent alloc] initWithEventName:eventName
                                              properties:properties
                                                 eventId:eventId];
  } else {
    baseEvent = [[TikTokBaseEvent alloc] initWithEventName:eventName
                                              properties:properties
                                                 eventId:nil];
  }

  [TikTokBusiness trackTTEvent:baseEvent];
}

+ (void)identifyWithExternalID:(NSString *_Nullable)externalID
             externalUserName:(NSString *_Nullable)externalUserName
                   phoneNumber:(NSString *_Nullable)phoneNumber
                         email:(NSString *_Nullable)email
{
  [TikTokBusiness identifyWithExternalID:externalID
                        externalUserName:externalUserName
                             phoneNumber:phoneNumber
                                   email:email];
}

+ (void)logout
{
  [TikTokBusiness logout];
}

+ (void)flush
{
  [TikTokBusiness explicitlyFlush];
}

+ (void)requestTrackingAuthorizationWithCompletionHandler:
    (void (^)(NSInteger status))completionHandler
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [TikTokBusiness requestTrackingAuthorizationWithCompletionHandler:^(NSUInteger status) {
      if (completionHandler != nil) {
        completionHandler((NSInteger)status);
      }
    }];
  });
}

@end
