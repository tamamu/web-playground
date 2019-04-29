const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.glsl$/,
        use: 'url-loader'
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: 'file-loader?name=/images/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/assets')
  },
  devServer: {
    open: true,
    watchContentBase: true,
    hot: true,
    contentBase: path.join(__dirname, 'dist/assets'),
  },
  plugins: [
    new HtmlWebPackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
