var path = require('path');
var webpack = require('webpack');
const readdirSync = require('fs').readdirSync;


const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin');

const tmplExt = '.njk';

const removeExt = (name, ext) => name.split(ext).join('');

const pages = readdirSync(path.resolve('src'))
  .filter((file) => file.includes(tmplExt))
  .map((page) => new HtmlWebpackPlugin({
    template: path.resolve(`src/${page}`),
    filename: path.resolve(`public/${removeExt(page, tmplExt)}.html`),
    //filename: path.resolve(`${removeExt(page, tmplExt)}.html`),
    inject: 'head',
    alwaysWriteToDisk: true,
}));

var PLUGINS = [];
PLUGINS.push(...pages)


PLUGINS.push(new CopyWebpackPlugin([
  { from: path.resolve('src/assets') },
]))
PLUGINS.push(new HtmlWebpackHarddiskPlugin())
PLUGINS.push(new Dotenv())
PLUGINS.push(new DashboardPlugin())
if (process.env.NODE_ENV === 'production') {
  //PLUGINS.push(new UglifyJSPlugin());
}

module.exports = {
  entry: './src/index.js',
  output: {
    //path: __dirname,
    //path: path.resolve('assets'),
    path: path.resolve('public/assets'),
    publicPath: 'assets/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.njk$/,
        use: [
          'html-loader',
          {
            loader: 'nunjucks-html-loader',
            options: {
              searchPaths: [
                path.resolve('src'),
                path.resolve('src/elements'),
              ],
            },
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      /*
      {
        test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
        loader: 'file-loader'
      }
      */
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              limit: 10000,
            },
          },
        ],
      },
    ]
  },
  devServer: {
    contentBase: [
      path.resolve('public'),
    ],
  },
  plugins: PLUGINS
};