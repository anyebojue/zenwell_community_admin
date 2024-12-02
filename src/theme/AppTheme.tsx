import * as React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'
import { inputsCustomizations } from './customizations/inputs' // 输入相关的自定义样式
import { dataDisplayCustomizations } from './customizations/dataDisplay' // 数据展示组件的自定义样式
import { feedbackCustomizations } from './customizations/feedback' // 反馈组件的自定义样式
import { navigationCustomizations } from './customizations/navigation' // 导航组件的自定义样式
import { surfacesCustomizations } from './customizations/surfaces' // 表面（卡片、对话框等）的自定义样式
import { colorSchemes, typography, shadows, shape } from './themePrimitives' // 基础主题原件（颜色方案、字体、阴影、形状等）

// 定义 AppTheme 的 props 类型
interface AppThemeProps {
  children: React.ReactNode // 子组件，用于包裹应用内容
  /**
   * 用于文档站点的特殊功能，生产环境中可以忽略或移除
   */
  disableCustomTheme?: boolean // 是否禁用自定义主题
  themeComponents?: ThemeOptions['components'] // 用户可以额外传入的组件自定义配置
}

// 定义 AppTheme 组件
const AppTheme = ({ children, disableCustomTheme, themeComponents }: AppThemeProps) => {
  // 使用 useMemo 缓存主题配置，避免每次重新渲染都创建新的主题对象
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {} // 如果禁用自定义主题，返回空配置
      : createTheme({
          // CSS 变量配置，更多详情参见：https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme', // 用于切换颜色模式的选择器
            cssVarPrefix: 'template' // 自定义 CSS 变量前缀
          },
          colorSchemes, // 配置颜色方案，用于实现浅色和深色模式
          typography, // 字体相关的主题配置
          shadows, // 阴影相关的主题配置
          shape, // 形状（如圆角）的主题配置
          components: {
            // 合并多个自定义的组件样式
            ...inputsCustomizations, // 输入相关组件的自定义样式
            ...dataDisplayCustomizations, // 数据展示相关组件的自定义样式
            ...feedbackCustomizations, // 反馈组件的自定义样式
            ...navigationCustomizations, // 导航组件的自定义样式
            ...surfacesCustomizations, // 表面组件的自定义样式
            ...themeComponents // 用户额外传入的组件自定义配置
          }
        })
  }, [disableCustomTheme, themeComponents]) // 当 disableCustomTheme 或 themeComponents 发生变化时重新计算主题

  // 如果禁用自定义主题，直接渲染子组件，不应用主题
  if (disableCustomTheme) {
    return children
  }

  // 包裹 ThemeProvider，将主题应用到子组件中
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}

// 使用 React.memo 提升性能，避免不必要的重新渲染
export default React.memo(AppTheme)
