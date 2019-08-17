const path = require("path");
const { HotModuleReplacementPlugin } = require("webpack");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AutoDllPlugin = require('autodll-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const bundleOutputDir = "./build";
const rel = process.env.NODE_ENV === "production";
const build_version = process.env.BUILD_VERSION || "0.0";
const vendor = Object.keys(require("./package.json").dependencies);

console.log("creating index. env: " + process.env.NODE_ENV);

const config = {
  stats: { modules: false },
  entry: { index: ["./index.tsx"] },
  context: path.resolve(__dirname, "src"),
  resolve: { extensions: [".ts", ".tsx", ".js"] },
  output: { path: path.join(__dirname, bundleOutputDir), filename: "[name].[hash].js", publicPath: "" },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader", exclude: path.resolve(__dirname, "node_modules"), include: path.resolve(__dirname, "src") },
      { test: /\.(svg|ttf|eot|woff|woff2)(\?[a-z0-9]+)?$/, loader: "file-loader?name=fonts/[name].[ext]", },
      { test: /\.css$/, use: [!rel ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader",] },
      { test: /\.(jpe?g|gif|png)$/, loader: "file-loader?name=images/[name].[ext]" }
    ]
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new MiniCssExtractPlugin({ filename: "[contenthash].css", chunkFilename: "[id].css" }),
    new HtmlWebpackPlugin({
      inject: true,
      template: "./index.html",
      favicon: "./resources/images/favicon.ico",
      build_version
    }),
    new AutoDllPlugin({
      entry: { vendor },
      filename: "vendor.[hash].js",
      inject: true,
      plugins: [new UglifyJsPlugin({ uglifyOptions: { output: { comments: false } } })]
    }),
    new TSLintPlugin({ files: ['./src/**/*.ts'] }),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      checkSyntacticErrors: true
    })
  ]
};

console.log("Build version: " + build_version);

if (rel) {
  console.log("Development environment disabled.");

  const prodPlugins = [new UglifyJsPlugin()];

  config.plugins = [...config.plugins, ...prodPlugins];
  config.mode = "production";

} else {
  console.log("Development environment enabled.");

  const devPlugins = [new HotModuleReplacementPlugin()];
  const apiHost = require("./localSettings.json").host;

  config.plugins = [...config.plugins, ...devPlugins];
  config.mode = "development";
  config.devtool = "source-map";
  config.devServer = {
    hot: true,
    port: 8080,
    compress: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "build"),
    proxy: {
      "/api/*": apiHost,
    }
  };
}

module.exports = config;