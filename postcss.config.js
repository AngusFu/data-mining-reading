// for test
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 0,
      features: {
        'nesting-rules': true
      }
    }
  }
}