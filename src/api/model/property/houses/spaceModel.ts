import { Page } from '../../pageModel'
import { SpaceOpenTimeReply } from './spaceOpenTimeModel'
import { VenueReply } from './venueModel'

export interface SpaceReply {
  id?: string
  createdAt?: string // 更新时间
  updatedAt?: string // 创建时间
  name?: string // 名称
  startTime?: string // 预约开始时间
  endTime?: string // 预约结束时间
  feeMoney?: number // 每小时预约费用
  adminName?: string // 管理员
  tel?: string // 管理员电话
  bId?: string // 业务ID
  communityId?: string // 小区ID
  stateCd?: number // 状态 1 可预约状态 2 不可预约状态
  statusCd?: number // 数据状态，详细参考c_status表，S 保存，0 在用，1 失效
  venueId?: string // 场馆ID
  venue?: VenueReply
  spaceOpenTime?: SpaceOpenTimeReply[]
}

export interface SpaceParams {
  id?: string
  name?: string // 名称
  startTime?: string // 预约开始时间
  endTime?: string // 预约结束时间
  feeMoney?: number // 每小时预约费用
  adminName?: string // 管理员
  tel?: string // 管理员电话
  bId?: string // 业务ID
  communityId?: string // 小区ID
  stateCd?: number // 状态 1 可预约状态 2 不可预约状态
  statusCd?: number // 数据状态，详细参考c_status表，S 保存，0 在用，1 失效
  venueId?: string // 场馆ID
  appointmentTime?: string
}

export interface FindSpaceReply {
  page: Page
  list: Array<SpaceReply>
}
