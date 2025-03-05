import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { load, NavigateIndex } from './load'
import menu from './modules/develop/menu'
import control from './modules/platform/control'
import community from './modules/platform/community'
import propertyCompany from './modules/platform/propertyCompany'
import organization from './modules/platform/organization'
import systemSetting from './modules/platform/systemSetting'
import communitys from './modules/property/communitys'
import houses from './modules/property/houses'
import feeConfig from './modules/property/feeConfig'
import repair from './modules/property/repair'
import inspection from './modules/property/inspection'
import report from './modules/property/report'
import organizations from './modules/property/organizations'
import systemSettings from './modules/property/systemSettings'

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
    element: React.createElement(NavigateIndex),
    meta: { hidden: true }
  },
  {
    path: '*',
    element: React.createElement(NavigateIndex),
    meta: { hidden: true }
  },
  {
    path: '/login',
    element: load('Login'),
    isFullPage: true,
    meta: { hidden: true }
  },
  {
    path: '/FeeConfig/ReceiptReprint',
    element: load('Property/FeeConfig/ReceiptReprint'),
    isFullPage: true,
    meta: { hidden: true }
  },
  {
    path: '/FeeConfig/MakeUpTheReceipt',
    element: load('Property/FeeConfig/MakeUpTheReceipt'),
    isFullPage: true,
    meta: { hidden: true }
  }
]

// 获取完整路由
const useAllRoutes = (): IRouter[] => {
  const info = useSelector((state: RootState) => state.info.userInfo)
  switch (info.platform) {
    case '1':
      return [
        ...baseRoutes,
        ...control,
        ...community,
        ...propertyCompany,
        ...organization,
        ...systemSetting
      ]
    case '2':
      return [...baseRoutes, ...menu]
    case '0':
      return [
        ...baseRoutes,
        ...communitys,
        ...houses,
        ...feeConfig,
        ...repair,
        ...inspection,
        ...report,
        ...organizations,
        ...systemSettings
      ]
    default:
      return [...baseRoutes]
  }
}

export default useAllRoutes
