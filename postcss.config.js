module.exports = {
  plugins: [
    require('autoprefixer')({ browsers: 'last 2 versions' }),
    require('postcss-autoreset')({
      reset: {
        all: 'initial',
        'box-sizing': 'border-box',
      },
    }),
  ],
};
