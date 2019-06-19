const path = require('path');
const publicPath = path.join(__dirname, 'client', 'public');

module.exports = {
    mode: 'development',
    entry: './client/src',
    output: {
        filename: 'bundle.js',
        path: publicPath
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }]
    },
    node: {
        fs:'empty'
    }
}