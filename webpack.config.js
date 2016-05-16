const webpack = require('webpack');

module.exports = {
    entry: './scripts/app.js',
    output: {
        path: './build',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
}