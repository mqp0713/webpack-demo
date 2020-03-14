const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // webpack4 高低版本使用方式不同
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 清晰的展示出打包后的各个 bundle 所依赖的模块
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

var config = {
	mode: 'none', // dev 还是 prod 环境，webpack 会根据此值进行一些默认操作
	entry: {
    	main: path.join(__dirname, '../src/main.js') // 入口文件，webpack 会从该文件开始工作；__dirname 总是指向被执行 js 文件的绝对路径
	},
	output: {
		path: path.join(__dirname, '../dist'), // 打包后文件的输出目录
		// publicPath: '/dist/', // 指定资源文件引用的目录，如果资源存放在 cdn 上，可以写 cdn 的网址
		filename: '[name].bundle.js' // 输出文件的名称,name 为 entry 定义的名称
	},
	module: { // loader 预处理文件。转换成 webpack 识别的模块。loader 加载顺序是从右往左。
		rules: [
			{
				test: /.ejs$/, // EJS 是一套简单的模板语言，帮你利用普通的 JavaScript 代码生成 HTML 页面
				use: ['ejs-loader']
			},
			{
				test: /.css$/,
				use: [
					//'style-loader', // 使用<style>将css-loader内部样式注入到我们的HTML页面

          isDev ? 'vue-style-loader' : {
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					// 'css-loader' // 加载.css文件.注意加载顺序
					'postcss-loader'
				]
			},
			{
				test: /.(jpg|jpeg|png|gif|svg)$/, // 处理图片
				use: [
					{
						loader:'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							limit: 1024 //单位：字节（B） 大小小于该值时，返回 dataurl(base64)
						}
					}
				]
			},
			{
				test: /\.less$/, // 预处理 less 文件
				use:[
          // 'style-loader',
          isDev ? 'vue-style-loader' :
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
					'postcss-loader', // 自动添加 css 浏览器前缀
					'less-loader'
				]
			},
			{
				test: /\.js$/, // es6 转 es5
				loader: 'babel-loader',
				exclude: /node_modules/ // 排除
			},
			{
				test: /\.(vue|js)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				enforce: 'pre' // 预处理
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // options: createVueLoaderOptions(isDev)
      }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, '../index.html'), // 模板文件的路径，使用根目录下的 index.html
			inject: true, // 设置为 true 表示把 js 文件注入到 body 尾部， css 注入到 head 中
			minify: {
				removeComments: true // 表示删除模板文件中的注释
			}
		}),
		new CleanWebpackPlugin(), // 构建前清理 dist 目录
		new MiniCssExtractPlugin({
			filename: "[name].css"  // 样式以 link 标签的形式引入，替代 style 标签
		}),
    new BundleAnalyzerPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin() // 运行时更新模块，热替换
	],
	optimization: {
		splitChunks: {
			chunks: 'initial', // 用来选择分割哪些代码块，可选值有：'all'（所有代码块），'async'（按需加载的代码块），'initial'（初始化代码块）
			automaticNameDelimiter: '.', // 文件名的连接符
			cacheGroups: { // 缓存组
			    vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: 1
			    }
			}
		},
		    runtimeChunk: {
				name: entrypoint => `manifest.${entrypoint.name}`
			}
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    overlay: {
      errors: true // 错误提示
    },
    hot: true // 热更新
  },
  devtool: 'inline-source-map' // 加入 devtool 配置，增加错误提示的源码映射
};
// 相当于 export default config
module.exports = config;
