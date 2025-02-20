import { Page } from '../../pageModel'

export interface MeterTypeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  name?: string // 抄表类型
  status?: number
  remark?: string // 说明
}

export interface MeterTypeParams {
  id?: string
  communityId?: string
  name?: string // 抄表类型
  status?: number
  remark?: string // 说明
}

export interface FindMeterTypeReply {
  page: Page
  list: Array<MeterTypeReply>
}
