module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'tests/unit/*_spec.js',
      'tests/unit/**/*_spec.js'
    ],
    preprocessors: {
      'tests/unit/*_spec.js': ['webpack'],
      'tests/unit/**/*_spec.js': ['webpack']
    },
    webpack: require('./webpack.config.js'),
    webpackMiddleware: {
      noInfo: true,
      stats: {
        chunks: false
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-chai',
      'karma-sinon'
    ]
  });
};