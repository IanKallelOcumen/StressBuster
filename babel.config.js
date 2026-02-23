module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Disable reanimated plugin for web
      ...(process.env.NODE_ENV === 'web' ? [] : ['react-native-reanimated/plugin']),
    ],
  };
};