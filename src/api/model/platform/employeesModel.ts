import { Page } from '../pageModel'
import { RolesReply } from './rolesModel'

export interface EmployeesReply {
  actions: []
  code: string
  createdAt: string
  id: string
  lastLogin: string
  lockExpire: string
  lockMsg: string
  locked: boolean
  platform: string
  role: RolesReply
  roleId: string
  updatedAt: string
  username: string
}

export interface EmployeesParams {
  id?: string
  name?: string //小区名称
  city_code?: string //小区地区
  address?: string //小区地址
  nearby_landmarks?: string //附近地标
  tel?: string //客服电话
  pay_fee_month?: number //缴费周期
  fee_price?: number //每月单价
  b_id?: string //社区编码
  state?: string // 审核状态
}

export interface FindEmployeesReply {
  page: Page
  list: Array<EmployeesReply>
}
