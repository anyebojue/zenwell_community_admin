import { Page } from '../../pageModel'

export interface ResourceStoreTypeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  storeId?: string
  description?: string
  statusCd?: string
  parentId?: string
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
