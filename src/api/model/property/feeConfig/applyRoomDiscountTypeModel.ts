import { Page } from '../../pageModel'

export interface ApplyRoomDiscountTypeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  communityId?: string
  typeDesc?: string
  status?: number
  remark?: string
}

export interface ApplyRoomDiscountTypeParams {
  id?: string
  name?: string
  communityId?: string
  typeDesc?: string
  status?: number
  remark?: string
}

export interface FindApplyRoomDiscountTypeReply {
  page: Page
  list: Array<ApplyRoomDiscountTypeReply>
}
