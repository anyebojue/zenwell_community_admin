import { Page } from '../pageModel'

export interface RolesReply {
  id?: string
  name?: string // 角色名称
  plate?: string // 平台  0 物业 1平台 2开发
  word?: string
  users?: []
  actions?: []
}

export interface RolesParams {
  id?: string
  name?: string
  plate?: string
}

export interface FindRolesReply {
  page: Page
  list: Array<RolesReply>
}
