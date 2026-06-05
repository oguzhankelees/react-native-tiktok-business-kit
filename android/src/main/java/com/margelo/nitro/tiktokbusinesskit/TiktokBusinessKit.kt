package com.margelo.nitro.tiktokbusinesskit

import android.util.Log
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.tiktok.TikTokBusinessSdk
import com.tiktok.appevents.base.TTBaseEvent
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.CountDownLatch

@DoNotStrip
class TiktokBusinessKit : HybridTiktokBusinessKitSpec() {
    override fun initialize(config: TikTokInitializeConfig): Promise<Unit> {
        return Promise.parallel {
            val context =
                NitroModules.applicationContext?.applicationContext
                    ?: throw IllegalStateException("React Native context is not available")

            val ttConfig =
                TikTokBusinessSdk.TTConfig(context, config.appSecret)
                    .setAppId(config.appId)
                    .setTTAppId(config.ttAppId)

            if (config.debug == true) {
                ttConfig.setLogLevel(TikTokBusinessSdk.LogLevel.DEBUG)
                ttConfig.openDebugMode()
            }

            var initError: Throwable? = null
            val latch = CountDownLatch(1)

            TikTokBusinessSdk.initializeSdk(
                ttConfig,
                object : TikTokBusinessSdk.TTInitCallback {
                    override fun success() {
                        latch.countDown()
                    }

                    override fun fail(code: Int, msg: String?) {
                        initError =
                            TikTokSdkInitException(
                                code,
                                msg ?: "TikTok Business SDK initialization failed",
                            )
                        latch.countDown()
                    }
                },
            )

            latch.await()
            initError?.let { throw it }
        }
    }

    override fun trackEvent(event: String, paramsJson: String?, eventId: String?) {
        val builder =
            if (!eventId.isNullOrEmpty()) {
                TTBaseEvent.newBuilder(event, eventId)
            } else {
                TTBaseEvent.newBuilder(event)
            }

        paramsJson?.let { json ->
            val properties = JSONObject(json)
            val keys = properties.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                addProperty(builder, key, properties.get(key))
            }
        }

        Log.d(TAG, "trackEvent: $event paramsJson=$paramsJson")

        TikTokBusinessSdk.trackTTEvent(builder.build())
    }

    override fun identify(user: TikTokIdentifyUser) {
        TikTokBusinessSdk.identify(
            user.externalId,
            user.externalUserName,
            user.phoneNumber,
            user.email,
        )
    }

    override fun logout() {
        TikTokBusinessSdk.logout()
    }

    override fun flush() {
        TikTokBusinessSdk.flush()
    }

    override fun requestTrackingAuthorization(): Promise<Double> {
        return Promise.parallel { TRACKING_UNAVAILABLE }
    }

    override fun test(a: String) {
        Log.d(TAG, a)
    }

    companion object {
        private const val TAG = "TiktokBusinessKit"
        private const val TRACKING_UNAVAILABLE = -1.0

        private fun addProperty(
            builder: TTBaseEvent.Builder,
            key: String,
            value: Any?,
        ) {
            when (value) {
                null, JSONObject.NULL -> return
                is Boolean -> builder.addProperty(key, value)
                is Int -> builder.addProperty(key, value)
                is Long -> builder.addProperty(key, value)
                is Double -> builder.addProperty(key, value)
                is Float -> builder.addProperty(key, value)
                is String -> builder.addProperty(key, value)
                is Number -> {
                    val doubleValue = value.toDouble()
                    if (doubleValue % 1.0 == 0.0 && doubleValue >= Int.MIN_VALUE && doubleValue <= Int.MAX_VALUE) {
                        builder.addProperty(key, doubleValue.toInt())
                    } else {
                        builder.addProperty(key, doubleValue)
                    }
                }
                is JSONArray -> builder.addProperty(key, value)
                is JSONObject -> builder.addProperty(key, value)
                else -> builder.addProperty(key, value.toString())
            }
        }
    }
}

class TikTokSdkInitException(val code: Int, override val message: String) : Exception(message)
