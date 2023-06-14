const {resolve} = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (_env, argv) => {
    const isProd = argv.mode === 'production';

    return {
        entry: {
            main: resolve(__dirname, './src/index')
        },
        output: {
            path: resolve(__dirname, './dist'),
            filename: '[name].[contenthash].js',
            clean: true,
            assetModuleFilename: 'assets/images/[name][ext]'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts'],
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/,
                    type: 'asset/resource'
                },
                // {
                //     test: /\.css$/,
                //     use: ExtractTextPlugin.extract({
                //       fallback: 'style-loader',
                //       use: 'css-loader'
                //     })
                //   }
                {
                    test:/\.html$/,
                    use: [
                      'html-loader'
                    ]
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin( {
                template: resolve(__dirname, './src/index.html'),
                inject: 'head',
                scriptLoading: 'defer',
            }),
            new MiniCssExtractPlugin({
                filename: 'style.[contenthash].css'
            }),
            // new ExtractTextPlugin('styles.css')
        ],
        devtool: 'source-map',  
    };
    
};