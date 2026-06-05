import Foundation
import NitroModules

enum TikTokSdkError: Error {
	case invalidConfig
	case initFailed(String)

	var localizedDescription: String {
		switch self {
		case .invalidConfig:
			return "Invalid TikTok SDK configuration"
		case .initFailed(let message):
			return message
		}
	}
}

class TiktokBusinessKit: HybridTiktokBusinessKitSpec {
	func initialize(config: TikTokInitializeConfig) throws -> Promise<Void> {
		return Promise<Void>.async {
			try await withCheckedThrowingContinuation { continuation in
				TiktokBusinessKitBridge.initialize(
					withAccessToken: config.appSecret,
					appId: config.appId,
					tiktokAppId: config.ttAppId,
					debug: config.debug == true,
				) { error in
					if let error {
						let message =
							error.localizedDescription
							?? "TikTok Business SDK initialization failed"
						continuation.resume(throwing: TikTokSdkError.initFailed(message))
						return
					}

					continuation.resume()
				}
			}
		}
	}

	func trackEvent(
		event: String,
		paramsJson: String?,
		eventId: String?,
	) throws {
		let properties = Self.parseProperties(paramsJson)
		TiktokBusinessKitBridge.trackEvent(
			withName: event,
			properties: properties,
			eventId: eventId,
		)
	}

	func identify(user: TikTokIdentifyUser) throws {
		TiktokBusinessKitBridge.identify(
			withExternalID: user.externalId,
			externalUserName: user.externalUserName,
			phoneNumber: user.phoneNumber,
			email: user.email,
		)
	}

	func logout() throws {
		TiktokBusinessKitBridge.logout()
	}

	func flush() throws {
		TiktokBusinessKitBridge.flush()
	}

	func requestTrackingAuthorization() throws -> Promise<Double> {
		return Promise<Double>.async {
			await withCheckedContinuation { continuation in
				TiktokBusinessKitBridge.requestTrackingAuthorization(
					completionHandler: { status in
						continuation.resume(returning: Double(status))
					},
				)
			}
		}
	}

	func test(a: String) throws {}

	private static func parseProperties(_ paramsJson: String?) -> [String: Any] {
		guard let paramsJson, let data = paramsJson.data(using: .utf8) else {
			return [:]
		}

		guard
			let object = try? JSONSerialization.jsonObject(with: data),
			let dictionary = object as? [String: Any]
		else {
			return [:]
		}

		return dictionary
	}
}
