const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const alias = require('../alias');

const bubleOptions = {
  target: { chrome: 52, firefox: 48 },
  objectAssign: 'Object.assign',
}

module.exports = {
  entry: {
    popup: './src/popup.js',
    inject: './src/inject.js',
    backend: './src/backend.js',
    background: './src/background.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  resolve: {
    alias,
  },
  module: {
    rules: [
      {
        test: /iview\/.*?js$/,
        loader: 'buble-loader',
      },
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules|vue\/dist|vuex\/dist/,
        options: bubleOptions,
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              extractCSS: process.env.NODE_ENV === 'production',
              loaders: {
                sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                scss: 'vue-style-loader!css-loader!sass-loader',
                less: 'vue-style-loader!css-loader!less-loader'
              },
              preserveWhitespace: false,
              buble: bubleOptions,
            },
          },
          {
            loader: 'iview-loader',
            options: {
              prefix: false,
            }
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.less/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=0',
      },
    ],
  },
  performance: {
    hints: false,
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new VueLoaderPlugin(),
  ],
}

if (process.env.NODE_ENV === 'production') {
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  module.exports.plugins = [
    ...module.exports.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: { mangle: true },
      cache: true,
      parallel: true,
    }),
  ]
}