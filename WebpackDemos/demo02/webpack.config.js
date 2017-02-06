const webpack = require("webpack")

module.exports = {
  entry: {
    //app: ["./app/entry.js", "./app/home.js", "./app/sign.js"],
    entry: "./app/entry.js",
    home: "./app/home.js",
    sign: "./app/sign.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
    ]
  }
}
