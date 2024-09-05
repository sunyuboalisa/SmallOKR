const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  server: {
    port: 8081, // 指定你想要的端口号
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'mp4', 'wav', 'ogg'], // 处理这些文件类型
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
