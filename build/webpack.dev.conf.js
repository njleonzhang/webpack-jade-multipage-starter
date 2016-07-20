var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var glob = require("glob")
var path = require('path')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    // loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    loaders: [
      // 将sass抽成文件
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css!postcss!sass")
      },
    ]
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // new ExtractTextPlugin('./static/[name].css'),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // })
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "static/commons.js"
    }),
    new ExtractTextPlugin('./static/[name].css'),
  ]
})

var pugTemplates = glob.sync("./src/pages/**/*.pug")
pugTemplates.forEach(function(template) {
  var fileName = path.parse(template).name
  var html = {
    filename:  fileName + ".html",
    template: template,
    chunks: ['commons', fileName],
    inject: 'body'
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(html))
})

module.exports = webpackConfig
