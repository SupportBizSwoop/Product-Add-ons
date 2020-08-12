require("dotenv").config({
	path: "./.env",
});

process.env.BASE_PORT = process.env.BASE_PORT || "01";

const path = require("path");
const basePath = path.resolve(__dirname);
const srcPath = path.resolve(basePath, "src");

const HOST = "localhost";
const PORT = 3000;

module.exports = {
	entry: {
		adminGroups: path.join(srcPath, "admin/groups/index.js"),
		adminGroup: path.join(srcPath, "admin/group/index.js"),
	},
	output: {
		path: path.resolve(__dirname, "assets/core"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: "css-loader",
			},
			{
				test: /\.pcss$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: true,
							importLoaders: 1,
							localIdentName: "[local]___[hash:base64:5]",
						},
					},
					"postcss-loader",
				],
			},
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				use: "babel-loader",
			},
		],
	},
	resolve: {
		extensions: [".js", ".json", ".jsx"],
		alias: {
			app: srcPath,
		},
	},
	devServer: {
		open: true,
		openPage: "wp-admin/edit.php?post_type=product&page=za_groups",
		quiet: true,
		contentBase: path.join(basePath, "assets/core"),
		publicPath: "/wp-content/plugins/zAddon/assets/core",
		port: PORT,
		host: HOST,
		overlay: true,
		compress: true,
		watchOptions: {
			ignored: /node_modules/,
			aggregateTimeout: 1000,
			poll: 2000,
		},
		proxy: {
			"**": {
				target: `http://localhost:80${process.env.BASE_PORT}/`,
				changeOrigin: true,
				secure: false,
				headers: {
					"X-Webpack-Dev-Server": "yes",
					"X-Webpack-Dev-Server-Base-URL": `http://${HOST}:${PORT}`,
				},
			},
		},
	},
};
