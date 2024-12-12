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
    publicPath: '/'
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
    hints: 'warning',
    maxAssetSize: 600000, // 单个资源最大限制 (600 KiB)
    maxEntrypointSize: 600000 // 入口点最大限制 (600 KiB)
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
      template: './index.html'
    }),
    isDev ? new RefreshPlugin() : null
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 500000,
      automaticNameDelimiter: '-',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10
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
    proxy: [
      {
        context: ['/api'],
        target: 'https://community-admin.zenwell.cn/',
        changeOrigin: true
      }
    ]
  }
})
