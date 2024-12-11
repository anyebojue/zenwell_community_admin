import React, { ReactNode } from 'react'
import { load, navigateIndex } from './load'
import control from './modules/platform/control'
import community from './modules/platform/community'
import propertyCompany from './modules/platform/propertyCompany'
import organization from './modules/platform/organization'

export interface IRouter {
  /** 链接路径 */
  path: string
  /** 渲染的组件 */
  element?: ReactNode
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
    element: navigateIndex,
    meta: { hidden: true }
  },
  {
    path: '/login',
    element: load('Login'),
    isFullPage: true,
    meta: { hidden: true }
  }
]

const getAllRoutes = (): IRouter[] => [
  ...baseRoutes,
  ...control,
  ...community,
  ...propertyCompany,
  ...organization
]

export default getAllRoutes()
