var path = require('path')

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, './dist'),
    filename: "[name].js"
    publicPath: '/dist/'
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    grogress: true,
  },
  module: {
    loader: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css!autoprefixer' },
      { test: /\.scss$/, loader: 'style!css!sass?sourceMap' },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' },
      { test: /\.(hteml|tpl)$/, loader: 'html-loader' },
    ]
  },
  vue: {
    loaders: {
      css: 'style!css!autoprefixer'
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  resolve: {
    extensions: ["", '.js', '.vue'],
    alias: {
      filter: path.join(__dirname, './src/filters'),
      components: path.join(__dirname, './src/components')
    }
  },
  devtool: 'eval-source-map'
}
