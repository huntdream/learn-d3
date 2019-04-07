const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: './src/app.js',
    sort: './src/sort.js'
  },
  devServer: {
    open: true
  },
  output: {
    filename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|svg|gif|csv)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './assets/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin('build'),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: 'index',
      title: 'D3',
      chunks: ['index']
    }),
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: 'sort',
      title: 'Sort',
      chunks: ['sort']
    })
  ]
};

module.exports = config;
