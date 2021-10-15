const { resolve } = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'development', //通过配置是开发环境还是生产环境，webpack会有不同的优化策略
  entry: {
    index: './src/main.js',
  },
  output: {
    filename: 'js/[index]-[hash:5].js',
    path: resolve(__dirname, 'docs'),
    assetModuleFilename: 'assets/[name][ext][query]',
    clean: true
  },
  // webpack-dev-server need webpack-dev-server plugin
  devServer: {
    // 设置端口
    static: './docs/',
    port: 1300,
    open: true,
    hot: true
  },
  module: {
    rules: [{
      test: /\.(less|css)$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
      },
      ],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.html$/i,
      use: [{
        loader: 'html-loader',
      }]
    }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[hash:5].css'
    })
  ],
  resolve: {
    // 配置可以忽略那些类型的文件后缀。
    extensions: [
      '.js', '.ts'
    ],
    modules: [
      resolve(__dirname, './node_modules'), 'node_modules'
    ]
  }
};