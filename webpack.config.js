const webpack = require('webpack')

module.exports = {
  entry: './public/js/index.js',
  output: {
    path: __dirname, filename: './public/build/bundle.js',
  },
  devServer: {
    contentBase: './public/',
  },
  eslint: { configFile: './.eslintrc.json' },
  module: {
    preLoaders: [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }],
    loaders: [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
      },
    }],
  },
}
