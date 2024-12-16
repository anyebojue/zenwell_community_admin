import { Page } from '../pageModel'

export interface EmployeesReply {
  actions: []
  address: string // 地址
  code: string
  createdAt: string
  email: string // 邮箱
  id: string
  lastLogin: string
  lockExpire: string
  lockMsg: string
  locked: boolean
  mobile: string // 手机号
  platform: string
  position: string // 岗位
  // role: RolesReply
  roleId: string
  sex: number // 性别
  updatedAt: string
  username: string // 名称
  idcard: string // 身份证
  org: string // 关联组织
}

export interface EmployeesParams {
  id?: string
  username?: string // 名称
  sex?: number // 性别
  mobile?: string // 手机号
  position?: string // 岗位
  email?: string // 邮箱
  address?: string // 地址
  idcard?: string // 身份证
  org?: string // 关联组织
}

export interface FindEmployeesReply {
  page: Page
  list: Array<EmployeesReply>
}
