const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript path mapping
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@assets': path.resolve(__dirname, 'assets'),
};

// Enable TypeScript support
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;
