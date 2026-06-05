#include <jni.h>
#include "tiktokbusinesskitOnLoad.hpp"

#include <fbjni/fbjni.h>


JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, []() {
    margelo::nitro::tiktokbusinesskit::registerAllNatives();
  });
}