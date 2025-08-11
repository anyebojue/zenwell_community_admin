import { Page } from '../../pageModel'
import { StoreTypeReply } from './storeTypeModel'

export interface ResourceStoreTypeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  storeId?: string
  description?: string
  statusCd?: string
  parentId?: string
  storeType?: StoreTypeReply
}

export interface ResourceStoreTypeParams {
  id?: string
  name?: string
  storeId?: string
  description?: string
  statusCd?: string
  parentId?: string
  startTime?: string
  endTime?: string
}

export interface FindResourceStoreTypeReply {
  page: Page
  list: Array<ResourceStoreTypeReply>
  isExport?: boolean
}
