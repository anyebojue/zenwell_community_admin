import { Page } from '../../pageModel'
import { FeeConfigReply } from './feeConfigModel'

export interface FeeComboMemberReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  comboId?: string
  configId?: string
  communityId?: string
  status?: number
  remark?: string
  feeConfig?: FeeConfigReply
}

export interface FeeComboMemberParams {
  id?: string
  comboId?: string
  configId?: string
  communityId?: string
  status?: number
  remark?: string
}

export interface FindFeeComboMemberReply {
  page: Page
  list: Array<FeeComboMemberReply>
}
