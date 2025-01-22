import { Page } from '../pageModel'
import { SpacePersonReply } from './spacePersonModel'

export interface SpaceConfirmOrderReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  spId?: string // 预约ID
  spaceId?: string // 场地ID
  communityId?: string // 小区ID
  remark?: string // 备注
  status?: number // 记录状态，0 禁用，1 启用
  spacePerson?: SpacePersonReply
}

export interface SpaceConfirmOrderParams {
  id?: string
  spId?: string // 预约ID
  spaceId?: string // 场地ID
  communityId?: string // 小区ID
  remark?: string // 备注
  status?: number // 记录状态，0 禁用，1 启用
  personName?: string
  personTel?: string
  appointmentTime?: string
}

export interface FindSpaceConfirmOrderReply {
  page: Page
  list: Array<SpaceConfirmOrderReply>
}
