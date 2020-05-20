/**
 * Created by sean@ihuanqu.com on 2018/8/30.
 */

const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const SRC_PATH = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  entry:{
    main:["babel-polyfill",path.resolve(SRC_PATH,"index")]
  },
  output:{
    path: DIST_PATH,
    publicPath: '/',
    filename: 'scripts/[name].[hash].js',
    chunkFilename: 'scripts/[name].[chunkhash].js'
  },
  devServer: {
    contentBase: "dist",
    //热更新
    hot:true,
    overlay: true,
    historyApiFallback: true,
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use:["style-loader","css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test:/\.(jpg|png|svg|gif)$/,
        //多个loader需要从后到前进行解析(大于1000kb打包)
        use:["url-loader?limit=1000&name=images/[name]-[hash:8].[ext]"]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template:"./src/index.html",
      filename:"./index.html",
      chunks: ['main'],
      inject: 'body'
    })
  ]
};