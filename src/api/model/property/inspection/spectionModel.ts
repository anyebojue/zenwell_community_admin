import { Page } from '../../pageModel'

export interface SpectionReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: number // 员工处理状态
  remark?: string // 备注
  itemName?: string // 巡检项目
  communityId?: string // 小区ID
}

export interface SpectionParams {
  id?: string
  status?: number // 员工处理状态
  remark?: string // 备注
  itemName?: string // 巡检项目
  communityId?: string // 小区ID
}

export interface FindSpectionReply {
  page: Page
  list: Array<SpectionReply>
}
