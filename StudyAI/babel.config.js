module.exports = function(api) {
    api.cache(true);
    return {
      presets: [
        'babel-preset-expo',
        'nativewind/babel', // This is the line for NativeWind
      ],
      plugins: [
        'react-native-reanimated/plugin',
      ],
    };
  };