const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config');
config.devtool = 'source-map';
config.output = {
    path: path.resolve(__dirname, './'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].bundle.js.map',
    publicPath: '/'
}
config.devServer = {
  contentBase: path.resolve(__dirname, './dist')
}
module.exports = config;