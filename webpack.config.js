const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const vendors = [
  'babel-polyfill',
  'es5-shim/es5-shim',
  'es5-shim/es5-sham'
];
const bundle = function(app) {
  const files = vendors.concat([app]);
  return files;
};

module.exports = {
  context: path.resolve(__dirname, './app/assets/javascripts/'),
  entry: {
    'index': bundle('./')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'css!sass!postcss'
        )
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './app')
  }
};