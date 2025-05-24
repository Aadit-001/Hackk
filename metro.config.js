const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

// Get the default Metro configuration
const config = getDefaultConfig(__dirname);

// Add additional configurations if needed
config.resolver.sourceExts.push('mjs');

// Apply NativeWind transformer
module.exports = withNativeWind(config, { input: './app/global.css' });