import { Page } from '../../pageModel'

export interface StoreTypeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  storeTypeCd?: string
  name?: string
  description?: string
  isShow?: string
}

export interface StoreTypeParams {
  id?: string
  storeTypeCd?: string
  name?: string
  description?: string
  isShow?: string
  startTime?: string
  endTime?: string
}

export interface FindStoreTypeReply {
  page: Page
  list: Array<StoreTypeReply>
}
