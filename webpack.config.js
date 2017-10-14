'use strict';

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const args = require('minimist')(process.argv.slice(2));

const port = 8000;
const publicPath = '/';
const srcPath = path.join(__dirname, '/web');

// List of allowed environments
const allowedEnvs = ['dev', 'dist'];

// Set the correct environment
const env = allowedEnvs.includes(args.env) ? args.env : 'dev';
process.env.WEBPACK_ENV = process.env.WEBPACK_ENV || env;

const baseConfig = {
  output: {
    path: path.join(__dirname, '/web-dist'),
    filename: 'app.js',
    publicPath,
    sourceMapFilename: 'app.js.map',
  },
  devServer: {
    contentBase: srcPath,
    historyApiFallback: true,
    hot: true,
    port,
    publicPath,
    noInfo: false,
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      React: 'react',
    //   $: 'jquery',
    //   jQuery: 'jquery',
    }),
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
    alias: {
      models: srcPath + '/models/',
      views: srcPath + '/views/',
      styles: srcPath + '/styles/',
      // config: srcPath + '/config/' + process.env.WEBPACK_ENV,
      // jQuery: 'jquery',
    },
  },
  module: {
    // preLoaders: [{
    //   test: /\.(js|jsx)$/,
    //   include: srcPath,
    //   loader: 'eslint-loader',
    // }],
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          srcPath,
          // webpack-dev-server#1090 for Safari
          /node_modules\/webpack-dev-server/,
        ],
        query: {
          presets: ['env', 'react'],
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader',
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded&indentedSyntax',
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded',
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=8192&mimetype=image/svg+xml',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=8192&mimetype=application/octet-stream',
      },
      {
        test: /\.(ejs|html)$/,
        loader: 'ejs-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
};

const configs = {
  dev: {
    entry: [
      'webpack-dev-server/client?http://127.0.0.1:' + baseConfig.devServer.port,
      'webpack/hot/only-dev-server',
      path.join(srcPath, '/index'),
    ],
    cache: true,
    devtool: 'eval',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ].concat(baseConfig.plugins || []),
  },
  dist: {
    entry: {
      app: path.join(srcPath, '/index'),
    },
    cache: false,
    devtool: 'source-map',
    plugins: [
      new webpack.ExtendedAPIPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
      new UglifyJSPlugin({
        sourceMap: true,
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ].concat(baseConfig.plugins || []),
  },
};

module.exports = _.merge(configs[env], _.omit(baseConfig, 'plugins'));
