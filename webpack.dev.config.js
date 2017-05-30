const path = require('path');
const config = require('./webpack.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

config.devtool = 'source-map';

config.plugins = [
  new ExtractTextPlugin('[name].bundle.css')
];

config.output = {
  path: path.resolve(__dirname, './'),
  filename: '[name].bundle.js',
  sourceMapFilename: '[name].bundle.js.map',
  publicPath: '/'
};

config.devServer = {
  contentBase: path.resolve(__dirname, './dist')
};

module.exports = config;
