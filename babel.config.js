module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowUndefined: true,
        }
      ],
      '@babel/plugin-transform-runtime', // Ajoutez ce plugin pour éviter certains problèmes
    ],
  };
};
