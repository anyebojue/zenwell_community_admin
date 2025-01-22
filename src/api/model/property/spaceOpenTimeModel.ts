import { Page } from '../pageModel'

export interface SpaceOpenTimeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  spaceId?: string // 场地ID
  hours?: number // 小时
  isOpen?: number // 是否开放，1 是，0 否
  communityId?: '9032365411449962497' // 小区ID
  status?: number // 状态 0 禁用 1 启用
}

export interface SpaceOpenTimeParams {
  id?: string
  spaceId?: string // 场地ID
  hours?: number // 小时
  isOpen?: number // 是否开放，1 是，0 否
  communityId?: '9032365411449962497' // 小区ID
  status?: number // 状态 0 禁用 1 启用
}

export interface FindSpaceOpenTimeReply {
  page: Page
  list: Array<SpaceOpenTimeReply>
}
