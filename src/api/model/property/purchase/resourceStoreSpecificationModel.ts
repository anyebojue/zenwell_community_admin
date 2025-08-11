import { Page } from '../../pageModel'
import { ResourceStoreTypeReply } from './resourceStoreTypeModel'

export interface ResourceStoreSpecificationReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  specName?: string
  rstId?: string
  bId?: string
  storeId?: string
  description?: string
  statusCd?: string
  parentRstId?: string
  resourceStoreType?: ResourceStoreTypeReply
}

export interface ResourceStoreSpecificationParams {
  id?: string
  specName?: string
  rstId?: string
  bId?: string
  storeId?: string
  description?: string
  statusCd?: string
  parentRstId?: string
  startTime?: string
  endTime?: string
}

export interface FindResourceStoreSpecificationReply {
  page: Page
  list: Array<ResourceStoreSpecificationReply>
}
