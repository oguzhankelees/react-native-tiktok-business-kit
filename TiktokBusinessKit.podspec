require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "TiktokBusinessKit"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/oguzhankelees/react-native-tiktok-business-kit.git", :tag => "#{s.version}" }

  s.source_files = [
    "ios/**/*.{swift,h}",
    "ios/**/*.{m,mm}",
    "cpp/**/*.{hpp,cpp}",
  ]

  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  s.dependency 'TikTokBusinessSDK', '~> 1.6.1'

  load 'nitrogen/generated/ios/TiktokBusinessKit+autolinking.rb'
  add_nitrogen_files(s)

  current_public_header_files = Array(s.attributes_hash['public_header_files'])
  s.public_header_files = current_public_header_files + [
    "ios/TiktokBusinessKitBridge.h",
  ]

  current_pod_target_xcconfig = s.attributes_hash['pod_target_xcconfig'] || {}
  s.pod_target_xcconfig = current_pod_target_xcconfig.merge({
    'HEADER_SEARCH_PATHS' => '$(inherited) "${PODS_ROOT}/Headers/Public/TikTokBusinessSDK"',
  })

  install_modules_dependencies(s)
end
