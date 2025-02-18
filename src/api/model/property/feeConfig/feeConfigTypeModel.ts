import { Page } from '../../pageModel'

export interface FeeConfigTypeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
}

export interface FeeConfigTypeParams {
  id?: string
  name?: string
}

export interface FindFeeConfigTypeReply {
  page: Page
  list: Array<FeeConfigTypeReply>
}
