import { Page } from '../../pageModel'

export interface FeeComboMemberReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  comboId: string
  configId: string
  communityId: string
  status: number
  remark: string
}

export interface FeeComboMemberParams {
  id?: string
  comboId: string
  configId: string
  communityId: string
  status: number
  remark: string
}

export interface FindFeeComboMemberReply {
  page: Page
  list: Array<FeeComboMemberReply>
}
