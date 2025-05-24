module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo
      'react-native-reanimated/plugin',
    ],
  };
};
  

  