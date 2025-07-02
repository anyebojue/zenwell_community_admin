import { Page } from '../../pageModel'

export interface VenueReply {
  id?: string
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  name?: string // 场馆名称
  remark?: string // 描述
  communityId?: string // 小区ID
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0 在用，1 失效
  startTime?: string // 开馆时间
  endTime?: string // 闭馆时间
}

export interface VenueParams {
  id?: string
  name?: string // 场馆名称
  remark?: string // 描述
  communityId?: string // 小区ID
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0 在用，1 失效
  startTime?: string // 开馆时间
  endTime?: string // 闭馆时间
}

export interface FindVenueReply {
  page: Page
  list: Array<VenueReply>
}
