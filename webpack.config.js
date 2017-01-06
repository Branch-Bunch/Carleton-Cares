module.exports = {
  entry: './public/js/index',
  output: {
    path: __dirname, filename: './public/build/bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
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
