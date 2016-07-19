var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require("glob");
var path = require("path");

var entries = glob.sync("./src/pages/**/*.js");
console.log(entries);
var jadeTemplates = glob.sync("./src/pages/**/*.jade");

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
      new ExtractTextPlugin('./static/style.css')
    ]
};

jadeTemplates.forEach(function(template) {
  var html = {
    filename:  path.parse(template).name + ".html",
    template: template,
    inject: 'body'
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(html))
})

module.exports = webpackConfig
