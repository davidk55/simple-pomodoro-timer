const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

// const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: mode,
  // entry: {
  //   main: path.resolve(__dirname, 'src/main.js')
  // },
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: '[name][contenthash].js',
  //   clean: true,
  //   assetModuleFilename: '[name][ext]'
  // },

  devtool: 'source-map',
  devServer: {
    static: 'dist',
    // port: 3000,
    open: true,
    hot: true,
    // compress: true,
    // historyApiFallback: true,
    watchFiles: ['src/**/*'],
  },

  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "" }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpe?g|gif|wav|mp3)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Simple Pomodoro Timer',
      filename: './index.html',
      template: './src/template.html',
      favicon: './src/assets/favicon.svg'
    }),
    new MiniCssExtractPlugin(),
  ],
};
