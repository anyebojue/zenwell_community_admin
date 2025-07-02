import * as React from 'react'
import { Theme, alpha, Components } from '@mui/material/styles'
import {
  SvgIconProps,
  buttonBaseClasses,
  dividerClasses,
  menuItemClasses,
  selectClasses,
  tabClasses
} from '@mui/material'
import { UnfoldMoreRounded } from '@mui/icons-material'
import { gray, brand } from '../themePrimitives' // 引入灰色和品牌相关的颜色配置

// 自定义图标组件，用于替换默认的下拉菜单图标
const IconComponent = React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
  <UnfoldMoreRounded fontSize="small" {...props} ref={ref} />
))
IconComponent.displayName = 'IconComponent'

// 导航相关组件的自定义样式配置
export const navigationCustomizations: Components<Theme> = {
  // 自定义菜单项（MenuItem）的样式
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius, // 圆角
        padding: '6px 8px', // 内边距
        // 当菜单项处于焦点时的样式
        [`&.${menuItemClasses.focusVisible}`]: {
          backgroundColor: 'transparent' // 背景色透明
        },
        // 当菜单项被选中时的样式
        [`&.${menuItemClasses.selected}`]: {
          [`&.${menuItemClasses.focusVisible}`]: {
            backgroundColor: alpha(theme.palette.action.selected, 0.3) // 使用选中颜色的透明版本
          }
        }
      })
    }
  },
  // 自定义菜单（Menu）的样式
  MuiMenu: {
    styleOverrides: {
      list: {
        gap: '0px', // 子项间距
        // 分割线的样式
        [`&.${dividerClasses.root}`]: {
          margin: '0 -8px'
        }
      },
      // 菜单弹出的容器样式
      paper: ({ theme }) => ({
        marginTop: '4px', // 上间距
        borderRadius: theme.shape.borderRadius, // 圆角
        border: `1px solid ${theme.palette.divider}`, // 边框颜色
        backgroundImage: 'none', // 禁用背景图像
        background: 'hsl(0, 0%, 100%)', // 背景颜色
        boxShadow:
          'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px', // 阴影
        [`& .${buttonBaseClasses.root}`]: {
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.action.selected, 0.3) // 选中时的背景色
          }
        },
        // 深色模式的样式
        ...theme.applyStyles('dark', {
          background: gray[900], // 深灰背景
          boxShadow:
            'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
        })
      })
    }
  },
  // 自定义下拉选择框（Select）的样式
  MuiSelect: {
    defaultProps: {
      IconComponent // 替换默认图标组件
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius, // 圆角
        border: '1px solid', // 边框
        borderColor: gray[200], // 边框颜色
        backgroundColor: theme.palette.background.paper, // 背景色
        boxShadow: `inset 0 1px 0 1px hsla(220, 0%, 100%, 0.6), inset 0 -1px 0 1px hsla(220, 35%, 90%, 0.5)`, // 内阴影
        '&:hover': {
          borderColor: gray[300], // 悬浮时边框颜色
          backgroundColor: theme.palette.background.paper,
          boxShadow: 'none' // 禁用阴影
        },
        [`&.${selectClasses.focused}`]: {
          outlineOffset: 0, // 去除外边框偏移
          borderColor: gray[400] // 聚焦时边框颜色
        },
        '&:before, &:after': {
          display: 'none' // 去除默认伪元素
        },
        // 深色模式的样式
        ...theme.applyStyles('dark', {
          borderRadius: theme.shape.borderRadius,
          borderColor: gray[700],
          backgroundColor: theme.palette.background.paper,
          boxShadow: `inset 0 1px 0 1px ${alpha(gray[700], 0.15)}, inset 0 -1px 0 1px hsla(220, 0%, 0%, 0.7)`,
          '&:hover': {
            borderColor: alpha(gray[700], 0.7),
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'none'
          },
          [`&.${selectClasses.focused}`]: {
            outlineOffset: 0,
            borderColor: gray[900]
          },
          '&:before, &:after': {
            display: 'none'
          }
        })
      }),
      select: ({ theme }) => ({
        display: 'flex', // 显示为 flex 布局
        alignItems: 'center', // 垂直居中
        ...theme.applyStyles('dark', {
          display: 'flex',
          alignItems: 'center',
          '&:focus-visible': {
            backgroundColor: gray[900] // 聚焦时的背景色
          }
        })
      })
    }
  },
  // 自定义链接组件（Link）的样式
  MuiLink: {
    defaultProps: {
      underline: 'none' // 默认禁用下划线
    },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary, // 文本颜色
        fontWeight: 500, // 字重
        position: 'relative', // 定位
        textDecoration: 'none', // 去除默认文本装饰
        width: 'fit-content', // 自适应宽度
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '1px',
          bottom: 0,
          left: 0,
          backgroundColor: theme.palette.text.secondary,
          opacity: 0.3,
          transition: 'width 0.3s ease, opacity 0.3s ease' // 动画过渡
        },
        '&:hover::before': {
          width: 0 // 悬浮时隐藏下划线效果
        },
        '&:focus-visible': {
          outline: `3px solid ${alpha(brand[500], 0.5)}`, // 聚焦时的外边框
          outlineOffset: '4px',
          borderRadius: '2px'
        }
      })
    }
  },
  // 自定义抽屉（Drawer）的样式
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.default // 背景色
      })
    }
  },
  // 自定义分页组件的样式
  MuiPaginationItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-selected': {
          color: 'white', // 选中时的文本颜色
          backgroundColor: theme.palette.grey[900] // 背景色
        },
        ...theme.applyStyles('dark', {
          '&.Mui-selected': {
            color: 'black',
            backgroundColor: theme.palette.grey[50]
          }
        })
      })
    }
  },
  // 自定义标签页（Tabs）的样式
  MuiTabs: {
    styleOverrides: {
      root: { minHeight: 'fit-content' }, // 最小高度适配内容
      indicator: ({ theme }) => ({
        // backgroundColor: theme.palette.grey[800], // 指示器颜色
        backgroundColor: '#2660ad', // 指示器颜色
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.grey[200] // 深色模式指示器颜色
        })
      })
    }
  },
  // 自定义标签页项（Tab）的样式
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: 'none',
        boxShadow: 'none',
        fontWeight: 'normal', // 默认字体正常，不加粗
        transition: 'color 0.3s ease-in-out', // 为颜色变化添加过渡效果
        padding: '6px 8px', // 内边距
        marginBottom: '8px', // 下间距
        textTransform: 'none', // 禁用大写转换
        minWidth: 'fit-content', // 最小宽度适配内容
        minHeight: 'fit-content', // 最小高度适配内容
        color: theme.palette.text.secondary, // 默认文本颜色
        borderRadius: theme.shape.borderRadius, // 圆角
        borderColor: 'transparent', // 默认透明
        '&:hover': {
          border: 'none',
          boxShadow: 'none',
          color: theme.palette.text.primary, // 悬浮时文本颜色
          backgroundColor: theme.palette.action.hover // 悬浮时背景色
        },
        [`&.${tabClasses.selected}`]: {
          fontWeight: 700, // 选中时字体加粗
          color: '#1d428a', // 文本颜色
          borderColor: theme.palette.divider // 边框颜色
        },
        ...theme.applyStyles('dark', {
          color: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
          '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.action.hover
          },
          [`&.${tabClasses.selected}`]: {
            fontWeight: 700,
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.primary
          }
        })
      })
    }
  },
  MuiStepConnector: {
    styleOverrides: {
      line: ({ theme }) => ({
        borderTop: '1px solid', // 顶部边框为1像素实线
        borderColor: theme.palette.divider, // 使用分隔线的颜色作为边框颜色
        flex: 1, // 使连接线在布局中均匀分布
        borderRadius: '99px' // 设置圆角，给线条更柔和的外观
      })
    }
  },
  MuiStepIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: 'transparent', // 默认图标颜色设置为透明
        border: `1px solid ${gray[400]}`, // 外边框颜色为灰色
        width: 12, // 图标宽度
        height: 12, // 图标高度
        borderRadius: '50%', // 图标为圆形
        '& text': {
          display: 'none' // 隐藏内部的文本
        },
        // 激活状态下的样式
        '&.Mui-active': {
          border: 'none', // 去除边框
          color: theme.palette.primary.main // 使用主题的主色作为颜色
        },
        // 完成状态下的样式
        '&.Mui-completed': {
          border: 'none', // 去除边框
          color: theme.palette.success.main // 使用主题的成功色作为颜色
        },
        // 深色模式下的样式
        ...theme.applyStyles('dark', {
          border: `1px solid ${gray[700]}`, // 深色模式下边框颜色为深灰色
          '&.Mui-active': {
            border: 'none',
            color: theme.palette.primary.light // 使用主色的浅色版本
          },
          '&.Mui-completed': {
            border: 'none',
            color: theme.palette.success.light // 使用成功色的浅色版本
          }
        }),
        // 配置针对特定属性的变体样式
        variants: [
          {
            props: { completed: true }, // 当图标的状态为 "已完成"
            style: {
              width: 12, // 保持宽度为12
              height: 12 // 保持高度为12
            }
          }
        ]
      })
    }
  },
  MuiStepLabel: {
    styleOverrides: {
      label: ({ theme }) => ({
        // 当步骤已完成时的样式
        '&.Mui-completed': {
          opacity: 0.6, // 标签透明度降低
          ...theme.applyStyles('dark', { opacity: 0.5 }) // 深色模式下透明度进一步降低
        }
      })
    }
  }
}
