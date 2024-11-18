import { fixupConfigRules } from '@eslint/compat'
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js'
import react from 'eslint-plugin-react/configs/recommended.js'
import globals from 'globals'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import typescriptEslintParser from '@typescript-eslint/parser'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'

const commonRules = {
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
  'import/no-extraneous-dependencies': 0,
  'import/prefer-default-export': 0,
  'import/no-mutable-exports': 1,
  'import/order': 1,
  'import/no-cycle': 0,
  'react/prop-types': 0,
  'react/jsx-props-no-spreading': 0,
  'react/destructuring-assignment': 0,
  'react/state-in-constructor': 0,
  'react/sort-comp': 1,
  'react/no-array-index-key': 0,
  'react/prefer-stateless-function': 0,
  'react/static-property-placement': 0,
  'react/no-unescaped-entities': 0,
  'react-hooks/rules-of-hooks': 1,
  'react-hooks/exhaustive-deps': 1,
  'react/no-did-update-set-state': 1,
  'react/no-danger': 0,
  'react/jsx-filename-extension': 0,
  'react/jsx-curly-brace-presence': 0,
  'jsx-a11y/click-events-have-key-events': 0,
  'jsx-a11y/mouse-events-have-key-events': 0,
  'jsx-a11y/no-noninteractive-element-interactions': 0,
  'jsx-a11y/no-static-element-interactions': 0,
  'jsx-a11y/anchor-is-valid': 0,
  'jsx-a11y/accessible-emoji': 0,
  'jsx-a11y/label-has-associated-control': 0,
  'unicorn/prevent-abbreviations': 'off',
  'react/react-in-jsx-scope': 'off', // 禁用必须导入React
  'prefer-arrow-callback': 'error', // 强制使用箭头函数作为回调
  'func-style': ['error', 'expression'], // 强制使用函数表达式而不是函数声明
  'react/function-component-definition': 'off', // 禁用函数组件必须是函数声明的规则
  'react/jsx-no-useless-fragment': 'error', // 确保不会出现不必要的片段
  'arrow-body-style': 'off', // 禁用箭头函数体样式规则
  '@typescript-eslint/no-unused-vars': 'error'
}

export default [
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...fixupConfigRules([
    {
      ...react,
      settings: {
        react: { version: 'detect' }
      }
    },
    reactJsx
  ]),
  {
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'], // 匹配 ts, js 文件
    ignores: ['node_modules/', 'dist/'], // 忽略规则
    languageOptions: {
      parser: typescriptEslintParser, // 指定解析器
      parserOptions: {
        project: ['./tsconfig.json'], // 指定 tsconfig 文件
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true, // 支持 JSX
          tsx: true
        }
      },
      globals: {
        ...globals.node // 启用 Node.js 的全局变量（包括 __dirname 和 process）
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      import: eslintPluginImport,
      'react-hooks': reactHooks,
      prettier: eslintPluginPrettier
    },
    rules: {
      ...commonRules
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  { ignores: ['dist/'] }
]
