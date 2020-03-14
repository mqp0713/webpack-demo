const merge = require('webpack-merge')
const common = require('./webpack.config.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    host: '127.0.0.1',
    overlay: {
      errors: true
    },
    historyApiFallback: {
      index: '/index.html'
    }
  }
})
