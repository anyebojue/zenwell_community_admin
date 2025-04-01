import { Page } from '../../pageModel'
import { CommunityReply } from '../communityModel'
import { EmployeesReply } from './employeesModel'

export interface RolesGroupReply {
  community?: CommunityReply
  communityId?: string
  createdAt?: string
  id?: string
  updatedAt?: string
  userGroup?: RolesReply
  userGroupId?: string
}

export interface RolesReply {
  id?: string
  name?: string // 角色名称
  plate?: string // 平台  0 物业 1平台 2开发
  word?: string
  users?: EmployeesReply[]
  actions?: { code: string }[]
}

export interface RolesParams {
  id?: string
  name?: string
  plate?: string
  users?: string
  word?: string
}

export interface FindRolesGroupReply {
  page: Page
  list: Array<RolesGroupReply>
}

export interface FindRolesReply {
  page: Page
  list: Array<RolesReply>
}
