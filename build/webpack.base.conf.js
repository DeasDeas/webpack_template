const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");
const StylelintPlugin = require('stylelint-webpack-plugin');

const PATH = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../public"),
  assets: "assets/",
};

module.exports = {
  externals: {
    paths: PATH,
  },
  // context: path.resolve(__dirname, "../src"),
  entry: {
    app: PATH.src,
  },
  output: {
    filename: `${PATH.assets}js/[name].js`,
    path: PATH.dist,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        // Pictures
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: "[name].[ext]",
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
      {
        // Fonts
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: `build/postcss.conf.js`,
              },
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: "postcss.config.js",
              },
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: [path.join(__dirname, "../node_modules")],
  },
  resolve: {
    modules: [path.join(__dirname, "../node_modules")],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATH.assets}css/[name].css`,
    }),
    new HtmlWebpackPlugin({
      hash: false,
      template: `${PATH.src}/index.html`,
      filename: "./index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        // Images:
        {
          from: `${PATH.src}/${PATH.assets}img`,
          to: `${PATH.assets}img`,
        },
        // Fonts:
        {
          from: `${PATH.src}/${PATH.assets}fonts`,
          to: `${PATH.assets}fonts`,
        },
        // Static (copy to '/'):
        {
          from: `${PATH.src}/static`,
          to: "",
        },
      ],
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          [
            "svgo",
            {
              plugins: extendDefaultPlugins([
                {
                  name: "removeViewBox",
                  active: false,
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                  },
                },
              ]),
            },
          ],
        ],
      },
    }),
    new StylelintPlugin({
      configFile: ".stylelintrc",
      context: PATH.src,
      exclude: ['node_modules', 'css'],
      fix: true
    }),
  ],
};
