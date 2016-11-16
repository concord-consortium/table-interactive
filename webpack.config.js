var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './js/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css!autoprefixer'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less!autoprefixer'
      },
      {
        test: /\.(png|jpg|gif)$/,
        // inline base64 URLs for <=8k images, direct URLs for the rest
        loader: 'url-loader?limit=8192'
      },
      {
        // Support ?123 suffix, e.g. ../fonts/m4d-icons.eot?3179539#iefix
        test: /\.(eot|ttf|woff|woff2|svg)((\?|\#).*)?$/,
        loader: 'url-loader?limit=8192'
      }
    ],
    noParse: [path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.js')]
  },
  resolve: {
    alias: {
      'handsontable': path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.js'),
      'handsontable.css': path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.css')
    }
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'public'}
    ])
  ]
};