const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');


module.exports = (_, options) => {
	const isProduction = (options.mode === 'production');
	const publicUrl = isProduction ? (require('./package.json').homepage || '') : '';

	return {
		entry: './src/index.js',
		resolve: {
			extensions: ['.js'],
		},
		devServer: {
			contentBase: '/src/App/public',
			historyApiFallback: true,
			port: 8000,
			host: '0.0.0.0',
		},
		devtool: 'eval',
		output: {
			filename: 'index.js',
			publicPath: `${publicUrl}/`,
			path: `${__dirname}/build`, // eslint-disable-line no-undef
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: [{
						loader: 'babel-loader',
						options: { presets: ['@babel/react', '@babel/env'] },
					}],
				},
				{
					test:/\.css$/,
					loader: 'style-loader!css-loader'
				},
			],
		},
		plugins: [
			new CopyWebpackPlugin([
				{ from: 'src/App/public' },
			]),
			new HtmlWebpackPlugin({
				template: 'src/App/public/index.html',
				inject: 'body',
				publicUrl: publicUrl
			}),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoEmitOnErrorsPlugin(),
			new GenerateSW(),
			new webpack.DefinePlugin({
				'process.env': {
					PUBLIC_URL: JSON.stringify(publicUrl),
				},
			}),
		],
	};
};