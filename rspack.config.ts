import * as path from 'path'
import { defineConfig } from '@rspack/cli'
import { rspack } from '@rspack/core'
import RefreshPlugin from '@rspack/plugin-react-refresh'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

// 判断当前环境是否为开发模式
const isDev = process.env.NODE_ENV === 'development'

// 公共路径配置
const paths = {
  src: path.resolve(__dirname, 'src'), // 源码目录
  dist: path.resolve(__dirname, 'dist'), // 打包输出目录
  public: '/' // 静态资源的公共路径
}

// 浏览器兼容目标，基于 Browserslist
const browserslistTargets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14']

export default defineConfig({
  context: __dirname, // 配置上下文目录
  entry: {
    main: './src/main.tsx' // 入口文件
  },
  output: {
    publicPath: paths.public, // 设置静态资源的公共路径
    path: paths.dist, // 输出文件存储路径
    filename: '[name].[contenthash:8].js', // 文件名规则，使用内容哈希避免缓存问题
    assetModuleFilename: 'assets/[name].[hash:8][ext]', // 其他资源文件的输出规则
    clean: true // 每次构建前清理输出目录
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '...'], // 自动解析的文件扩展名
    alias: {
      _mock: path.resolve(__dirname, './src/_mock'),
      api: path.resolve(__dirname, './src/api'),
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      configs: path.resolve(__dirname, './src/configs'),
      hooks: path.resolve(__dirname, './src/hooks'),
      layouts: path.resolve(__dirname, './src/layouts'),
      modules: path.resolve(__dirname, './src/modules'),
      pages: path.resolve(__dirname, './src/pages'),
      routes: path.resolve(__dirname, './src/routes'),
      styles: path.resolve(__dirname, './src/styles'),
      theme: path.resolve(__dirname, './src/theme'),
      types: path.resolve(__dirname, './src/types'),
      utils: path.resolve(__dirname, './src/utils')
    }
  },
  performance: {
    hints: isDev ? false : 'warning', // 仅在生产模式中给出性能提示
    maxAssetSize: 2_000_000, // 单个资源文件的最大大小限制 (2MB)
    maxEntrypointSize: 2_000_000 // 单个入口文件的最大大小限制 (2MB)
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 匹配图片文件
        type: 'asset/resource', // 使用资源模块加载方式
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]' // 输出图片的文件名规则
        }
      },
      {
        test: /\.(jsx?|tsx?)$/, // 匹配 JavaScript 和 TypeScript 文件
        use: [
          {
            loader: 'builtin:swc-loader', // 使用 SWC 作为编译器
            options: {
              jsc: {
                parser: { syntax: 'typescript', tsx: true }, // 支持 TypeScript 和 TSX 语法
                transform: {
                  react: {
                    runtime: 'automatic', // 自动引入 React，不需要手动 import React
                    development: isDev, // 启用开发模式特性
                    refresh: isDev // 启用 React 热更新
                  }
                }
              },
              env: { targets: browserslistTargets }, // 浏览器兼容性配置
              cache: true // 启用编译缓存
            }
          }
        ],
        exclude: /node_modules/ // 排除第三方模块
      }
    ]
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html', // 指定 HTML 模板文件
      inject: 'body' // 自动将脚本注入到 <body> 标签中
    }),
    isDev && new RefreshPlugin(), // 仅在开发模式启用 React 热更新插件
    !isDev &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // 生成静态报告文件
        openAnalyzer: false, // 不自动打开浏览器
        reportFilename: 'bundle-report.html' // 报告文件名
      })
  ].filter(Boolean), // 过滤掉无效值 (例如开发模式下未加载的插件)
  optimization: {
    minimize: !isDev, // 在生产模式下启用代码压缩
    usedExports: true, // 启用 Tree Shaking
    splitChunks: {
      chunks: 'all', // 对所有类型的 chunk 进行拆分
      minSize: 50_000, // 拆分的模块最小大小 (50 KB)
      maxSize: 300_000, // 拆分的模块最大大小 (300 KB)
      minChunks: 2, // 至少被引用两次的模块才会被拆分
      maxInitialRequests: 30, // 入口点的最大并行请求数
      maxAsyncRequests: 30, // 按需加载的最大并行请求数
      automaticNameDelimiter: '-', // 拆分模块文件名的连接符
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // 匹配第三方模块
          name: 'vendors', // 输出文件名为 `vendors`
          chunks: 'all',
          priority: -10, // 优先级
          reuseExistingChunk: true // 复用已存在的 chunk
        },
        react: {
          test: /[\\/]node_modules[\\/]react|react-dom/, // 匹配 React 和 ReactDOM 模块
          name: 'react',
          chunks: 'all',
          priority: -5
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/, // 匹配 MUI (Material-UI) 模块
          name: 'mui',
          chunks: 'all',
          priority: -5
        },
        commons: {
          test: /[\\/]src[\\/]/, // 匹配业务代码中的公共模块
          name: 'commons',
          minChunks: 2,
          priority: -20
        }
      }
    }
  },
  experiments: {
    css: true // 启用 CSS 模块化支持
  },
  devServer: {
    port: 5127, // 开发服务器端口号
    historyApiFallback: true, // 支持 SPA 路由回退到 index.html
    hot: true, // 启用模块热替换 (HMR)
    proxy: [
      {
        context: ['/api'],
        target: 'https://community-admin.zenwell.cn/',
        changeOrigin: true
      }
    ],
    compress: true, // 启用 gzip 压缩
    client: {
      overlay: true // 显示编译错误和警告
    }
  }
})
