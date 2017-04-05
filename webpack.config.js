const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './app/assets/javascripts/'),
  entry: {
    app: './app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        },
        {
          loader: 'eslint-loader',
          options: {}
        }],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: '/assets'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './app')
  }
};