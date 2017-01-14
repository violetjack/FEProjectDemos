var webpack = require("webpack")
module.exports = {
  //entry: ["./app/main.js"],
  entry: "./app/main.js",
  output: {
    path: __dirname + "/dist/",
    filename: "bundle.js"
  },
  module: {
    // 定义一系列的加载器loader
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.(png|jpg)$/, loader: "url-loader?limit=8192" },
    ]
  },
  // plugins中是一个数组！！
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
}
