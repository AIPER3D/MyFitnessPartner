const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: [/\.s[ac]ss$/i, /\.css$/i],
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader'
          // // Compiles Sass to CSS
          // 'sass-loader',
        ],
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".ts",".tsx",".css"],
    // extensions that are used
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    // publicPath : '/dist'
  }
}