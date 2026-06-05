#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TiktokBusinessKitBridge : NSObject

+ (void)initializeWithAccessToken:(NSString *)accessToken
                            appId:(NSString *)appId
                      tiktokAppId:(NSString *)tiktokAppId
                            debug:(BOOL)debug
                completionHandler:(void (^)(NSError *_Nullable error))completionHandler;

+ (void)trackEventWithName:(NSString *)eventName
                properties:(NSDictionary *)properties
                   eventId:(NSString *_Nullable)eventId;

+ (void)identifyWithExternalID:(NSString *_Nullable)externalID
             externalUserName:(NSString *_Nullable)externalUserName
                   phoneNumber:(NSString *_Nullable)phoneNumber
                         email:(NSString *_Nullable)email;

+ (void)logout;
+ (void)flush;

+ (void)requestTrackingAuthorizationWithCompletionHandler:
    (void (^)(NSInteger status))completionHandler;

@end

NS_ASSUME_NONNULL_END
