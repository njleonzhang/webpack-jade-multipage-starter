var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var glob = require("glob")
var webpack = require('webpack')

var entryFiles = glob.sync("./src/pages/**/*.js")
var entries = {}

// entry文件的名字不能重复
entryFiles.forEach(function(file) {
  var fileName = path.parse(file).name
  if(fileName in entryFiles) {
    console.error("entry文件名重复", fileName)
  }
  entries[fileName] = file
});

var webpackConfig = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: 'static/[name].js',
  },
  resolve: {
    extensions: ['', '.js', 'scss'],
    // fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      // 'src': path.resolve(__dirname, '../src'),
      // 'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'pages': '../src/pages'
    }
  },
  // resolveLoader: {
  //   fallback: [path.join(__dirname, '../node_modules')]
  // },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        // include: projectRoot,
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-html-loader'
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      'window.$' : 'jquery'
    })
  ],
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
}

module.exports = webpackConfig
