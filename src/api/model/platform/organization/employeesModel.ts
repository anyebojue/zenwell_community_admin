import { Page } from '../../pageModel'
import { RolesReply } from './rolesModel'

export interface EmployeesReply {
  actions: []
  address: string // 地址
  code: string
  createdAt: string
  email: string // 邮箱
  id: string
  idcard: string // 身份证
  lastLogin: string
  lockExpire: string
  lockMsg: string
  locked: boolean
  mobile: string // 手机号
  org: {
    createdAt: string
    description: string
    id: string
    name: string
    pId: string
    plate: string
    remark: string
    status: number
    updatedAt: string
  }[] // 关联组织
  plate: string // 平台
  platform: string // 平台
  position: string // 岗位
  role: RolesReply[]
  roleId: string
  sex: number // 性别
  updatedAt: string
  username: string // 名称
}

export interface EmployeesParams {
  id?: string
  username?: string // 名称
  position?: string // 岗位
  mobile?: string // 手机号
  idcard?: string // 身份证
  address?: string // 地址
  password?: string // 密码
  sex?: number // 性别
  platform?: string // 平台
}

export interface FindEmployeesReply {
  page: Page
  list: Array<EmployeesReply>
}
