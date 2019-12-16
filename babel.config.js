module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
  env: {
    test: {
      plugins: ["@babel/plugin-transform-runtime"]
    }
  }
};
