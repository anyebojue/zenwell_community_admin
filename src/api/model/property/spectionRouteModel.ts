import { Page } from '../pageModel'

export interface SpectionRouteReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string // 路线名称
  communityId?: string // 小区ID
  seq?: number // 路线顺序
  remark?: string // 备注说明
  status?: number // 数据状态，0 在用, 1 失效
}

export interface SpectionRouteParams {
  id?: string
  name?: string // 路线名称
  communityId?: string // 小区ID
  seq?: number // 路线顺序
  remark?: string // 备注说明
  status?: number // 数据状态，0 在用, 1 失效
}

export interface FindSpectionRouteReply {
  page: Page
  list: Array<SpectionRouteReply>
}
