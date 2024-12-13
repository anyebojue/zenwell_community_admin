import { Page } from '../pageModel'
import { RolesReply } from './rolesModel'

export interface EmployeesReply {
  id: string
  createdAt: string
  updatedAt: string
  username: string
  code: string
  platform: string
  locked: false
  lastLogin: string
  lockExpire: string
  lockMsg: string
  actions: []
  roleId: string
  role: RolesReply
  mobile: string
  email: string
  address: string
  sex: number
  position: string
}

export interface EmployeesParams {
  createdAt?: string
  id?: string
  name?: string
  orgId?: string
  orgs?: []
  updatedAt?: string
  userId?: string
  users?: []
}

export interface FindEmployeesReply {
  page: Page
  list: Array<EmployeesReply>
}
