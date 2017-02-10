const webpack = require('webpack')

const debug = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: './public/js/index',
  output: {
    path: __dirname, filename: './public/build/bundle.js',
  },
  devtool: debug ? 'inline-sourcemap' : null,
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  devServer: {
    contentBase: './public/',
  },
  eslint: { configFile: './.eslintrc.json' },
  module: {
    preLoaders: (debug) ? [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }] : [],
    loaders: [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
      },
    }],
  },
  plugins: debug ? [] : [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourcemap: false,
      compress: { warnings: false },
    }),
  ],
}
