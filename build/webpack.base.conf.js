var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var glob = require("glob")
var path = require("path")
var webpack = require("webpack")

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

var jadeTemplates = glob.sync("./src/pages/**/*.jade")

var webpackConfig = {
  entry: entries,
  output: {
    path: './dist',
    filename: 'static/[name].js',
  },
  resolve: {
    extensions: ['', '.js', 'scss'],
    alias: {
      'components': path.resolve(__dirname, '../src/components'),
      'pages': '../src/pages'
    }
  },
  module: {
      loaders: [
        // 编译jade
        {
          test: /\.jade$/,
          loader: 'jade'
        },
        // 预编译ES6
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        },
        // 将sass抽成文件
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("css!postcss!sass")
        }
      ]
    },
  plugins: [
      new ExtractTextPlugin('./static/[name].css'),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: "commons",
      //   filename: "commons.js",
      //   minChunks : Infinity
      // })
      new webpack.HotModuleReplacementPlugin() //热加载
  ],
  devServer: {
		contentBase: './',
		host: 'localhost',
		port: 9090,
		inline: true,
		hot: true,
	}
};

jadeTemplates.forEach(function(template) {
  var fileName = path.parse(template).name
  var html = {
    filename:  fileName + ".html",
    template: template,
    chunks: [fileName],
    inject: 'body'
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(html))
})

module.exports = webpackConfig
