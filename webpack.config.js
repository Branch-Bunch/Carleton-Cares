const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './public/js/index.js',
    output: {
        path: __dirname, filename: './public/js/bundle.js'
    },
    devServer: {
        contentBase: './public/'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}
