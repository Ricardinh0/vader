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
  context: path.resolve(__dirname, './app/client/'),
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
        test: /.(js|jsx)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract({
          fallback: [{
            loader: 'style-loader',
          }],
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader"
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: () => {
                  return [
                    require('autoprefixer')({ browsers: 'last 2 versions' })
                  ]
                }
              }
            }
          ]
        })
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].bundle.js.map',
    publicPath: '/dist'
  }
};