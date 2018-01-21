const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
    entry: './ts/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/')
    },
    externals: {
        jquery: 'jQuery',
        d3: 'd3',
        lodash: '_'
    }
};