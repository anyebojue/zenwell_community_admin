import * as path from 'path'
import { defineConfig } from '@rspack/cli'
import { rspack } from '@rspack/core'
import RefreshPlugin from '@rspack/plugin-react-refresh'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const isDev = process.env.NODE_ENV === 'development'

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14']

export default defineConfig({
  context: __dirname,
  entry: {
    main: './src/main.tsx'
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'), // 确保输出路径正确
    filename: '[name].[contenthash].js' // 使用内容哈希，确保每次修改时输出不同的文件
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
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
    hints: isDev ? false : 'warning',
    maxAssetSize: 2000000, // 提高单个资源的最大大小限制到 2 MB
    maxEntrypointSize: 2000000 // 提高入口点的最大大小限制到 2 MB
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // 图片资源单独存储并引用 URL
        generator: {
          filename: 'assets/images/[name].[hash][ext]' // 控制图片文件输出路径
        }
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev
                  }
                }
              },
              env: { targets },
              cache: true // 启用缓存
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      inject: 'body'
    }),
    new RefreshPlugin(), // React 刷新插件
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // 生成静态 HTML 文件
      openAnalyzer: false // 不自动打开浏览器
    })
  ].filter(Boolean),
  optimization: {
    minimize: true, // 启用代码压缩
    usedExports: true, // 启用树摇 Tree Shaking
    splitChunks: {
      chunks: 'all',
      minSize: 30000, // 默认值 30 KB，增大以减少过小的包
      maxSize: 300000, // 将模块限制为 300 KB，避免过多的小包
      minChunks: 2, // 至少引用两次才会被拆分
      maxInitialRequests: 30, // 限制入口点的最大并行请求数
      maxAsyncRequests: 30, // 限制按需加载的最大并行请求数
      automaticNameDelimiter: '-',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10
        },
        react: {
          test: /[\\/]node_modules[\\/]react|react-dom/,
          name: 'react',
          chunks: 'all',
          priority: -5
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: 'mui',
          chunks: 'all',
          priority: -5
        },
        commons: {
          test: /[\\/]src[\\/]/, // 将业务中复用率较高的部分打包
          name: 'commons',
          minChunks: 2,
          priority: -20
        }
      }
    }
  },
  experiments: {
    css: true
  },
  devServer: {
    port: 5127,
    historyApiFallback: true,
    hot: true, // 启用热更新
    proxy: [
      {
        context: ['/api'],
        target: 'https://community-admin.zenwell.cn/',
        changeOrigin: true
      }
    ],
    compress: true // 启用gzip压缩
  }
})
