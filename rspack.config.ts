import * as path from 'path'
import { defineConfig } from '@rspack/cli'
import { rspack } from '@rspack/core'
import RefreshPlugin from '@rspack/plugin-react-refresh'

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
    hints: isDev ? false : 'warning', // 在开发模式下禁用警告
    maxAssetSize: 1000000, // 增加最大资源大小限制 (1000 KiB)
    maxEntrypointSize: 1000000 // 增加最大入口点资源大小限制 (1000 KiB)
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset'
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
              env: { targets }
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
    new RefreshPlugin() // React 刷新插件
  ].filter(Boolean),
  optimization: {
    minimize: true, // 启用代码压缩
    usedExports: true, // 启用树摇
    splitChunks: {
      chunks: 'all',
      minSize: 30000, // 最小拆分大小
      maxSize: 500000, // 单个文件最大限制
      minChunks: 1, // 至少引用一次时拆分
      automaticNameDelimiter: '-',
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/]react|react-dom/,
          name: 'react',
          chunks: 'all'
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: 'mui',
          chunks: 'all'
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
