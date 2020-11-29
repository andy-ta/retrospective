const path = require("path");
const Dotenv = require('dotenv-webpack');
require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
  return ({
    entry: {
      app: "./src/app.tsx"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/'
              }
            }
          ]
        }
      ]
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      library: "[name]",
      // https://github.com/webpack/webpack/issues/5767
      // https://github.com/webpack/webpack/issues/7939
      devtoolNamespace: "retrospective",
      libraryTarget: "umd"
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new Dotenv()
    ],
    mode: "development",
    devtool: "inline-source-map"
  });
};
