import { Page } from '../../pageModel'

export interface FeeComboReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  name?: string
  status?: number
  remark?: string
}

export interface FeeComboParams {
  id?: string
  communityId?: string
  name?: string
  status?: number
  remark?: string
}

export interface FindFeeComboReply {
  page: Page
  list: Array<FeeComboReply>
}
