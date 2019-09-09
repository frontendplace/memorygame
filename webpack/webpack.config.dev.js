const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

// This will direct webpack to enter through ./index.ts,
// load all .ts and .tsx files through the ts-loader,
// and output a bundle.js file in our current directory
module.exports = merge(common, {
  target: 'web',
  mode,
  devtool,
  devServer: {
    inline: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  entry: './src/scripts/index.ts',
  module: {
    rules: [
      // {
      //   test: /\.(js)$/,
      //   exclude: /node_modules/,
      //   use: 'babel-loader'
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader?sourceMap=true', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  // output: {
  //   filename: 'bundle.js',
  //   path: path.resolve(__dirname, 'dist')
  // }
  output: {
    chunkFilename: 'js/[name].chunk.js'
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.(js)$/,
  //       include: Path.resolve(__dirname, '../src'),
  //       enforce: 'pre',
  //       loader: 'eslint-loader',
  //       options: {
  //         emitWarning: true,
  //       }
  //     },
  //     {
  //       test: /\.(js)$/,
  //       include: Path.resolve(__dirname, '../src'),
  //       loader: 'babel-loader'
  //     },
  //     {
  //       test: /\.s?css$/i,
  //       use: ['style-loader', 'css-loader?sourceMap=true', 'sass-loader']
  //     }
  //   ]
  // }
});
