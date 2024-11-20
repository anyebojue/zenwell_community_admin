import React, { lazy } from 'react'
import control from './modules/control'
import community from './modules/community'

export interface IRouter {
  /** 链接路径 */
  path: string
  /** 重定向路径 */
  redirect?: string
  /** 渲染的组件 */
  Component?: React.ComponentType<any>
  /** 是否全屏显示 */
  isFullPage?: boolean
  /** 路由的元信息 */
  meta?: {
    /** 标题 */
    title?: string
    /** 图标组件 */
    Icon?: React.FC
    /** 是否隐藏在侧边栏中 */
    hidden?: boolean
    /** 是否为单层路由 */
    single?: boolean
  }
  /** 子路由 */
  children?: IRouter[]
}

const baseRoutes: IRouter[] = [
  {
    path: '/',
    redirect: '/control',
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    Component: lazy(() => import('pages/Login')),
    isFullPage: true,
    meta: {
      hidden: true
    }
  }
]

const getAllRoutes = (): IRouter[] => [...baseRoutes, ...control, ...community]

export default getAllRoutes()
