package com.margelo.nitro.tiktokbusinesskit
  
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class TiktokBusinessKit : HybridTiktokBusinessKitSpec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
