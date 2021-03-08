const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      // {
      //   test: /\.ts/,
      //   use: 'ts-loader',
      //   include: [path.resolve(__dirname, 'src')]
      // },
      {
        test: /\.(ts|jsx|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/proposal-class-properties',
              '@babel/proposal-object-rest-spread'
            ]
          }
        }
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
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader'
        }]
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
          loader: 'file-loader'
        }]
      },
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx", ".css"],
    // extensions that are used
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    // publicPath : '/dist'
  }
}