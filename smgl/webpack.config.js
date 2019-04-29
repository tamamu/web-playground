const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin")

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Getting started with WASM"
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, "crate")
        }),
        new webpack.ProvidePlugin({
          TextDecoder: ["text-encoding", "TextDecoder"],
          TextEncoder: ["text-encoding", "TextEncoder"]
        })
    ],
    mode: "development"
};