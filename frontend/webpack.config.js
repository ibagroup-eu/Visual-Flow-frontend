/*
 * Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const loaderUtils = require('loader-utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getCSSModuleActualName = (context, localIdentName, localName, options) => {
    // Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
    const fileNameOrFolder = context.resourcePath.match(
        /index\.module\.(css|scss|sass)$/
    )
        ? '[folder]'
        : '[name]';
    // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
    const hash = loaderUtils.getHashDigest(
        path.posix.relative(context.rootContext, context.resourcePath) + localName,
        'md5',
        'base64',
        5
    );
    // Use loaderUtils to find the file or folder name
    const className = loaderUtils.interpolateName(
        context,
        `${fileNameOrFolder}_${localName}__${hash}`,
        options
    );
    // remove the .module that appears in every classname when based on the file.
    return className.replace('.module_', '_');
};

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js'
    },
    output: {
        publicPath: '/public/dist/',
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                parser: { System: false }
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                getLocalIdent: getCSSModuleActualName
                            }
                        }
                    },
                    {
                        loader: 'fast-sass-loader',
                        options: {
                            outputStyle: 'compressed',
                            includePaths: [path.resolve(__dirname, 'node_modules')]
                        }
                    }
                ],
                include: /\.module\.scss$/
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'fast-sass-loader',
                        options: {
                            outputStyle: 'compressed',
                            includePaths: [path.resolve(__dirname, 'node_modules')]
                        }
                    }
                ],
                exclude: /\.module\.scss$/
            },
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'perspectives'),
                    /\.test\.js$/
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    publicPath: 'dist'
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    plugins: [
        // A webpack plugin to remove/clean the output folder before building
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        // Remove all non-en locales of moment from final build (decreases bundle size)
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
    ],
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        https: true,
        hot: true,
        historyApiFallback: true
    },
    externals: []
};
