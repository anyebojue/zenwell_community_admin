import { Page } from '../../pageModel'

export interface ResourceStoreReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  storeI?: string
  resName?: string
  resCode?: string
  description?: string
  price?: number
  stock?: string
  statusCd?: string
  unitCode?: string
  remark?: string
  outLowPrice?: number
  outHighPrice?: number
  showMobile?: string
  shId?: string
  warningStock?: number
  averagePrice?: number
  rssId?: string
  rstId?: string
  miniUnitCode?: number
  miniUnitStock?: string
  miniStock?: string
  parentRstId?: string
  isFixed?: string
}

export interface ResourceStoreParams {
  id?: string
  shId?: string
  resName?: string
  resCode?: string
  parentRstId?: string
  rstId?: string
  is_fixed?: string
}

export interface FindResourceStoreReply {
  page: Page
  list: Array<ResourceStoreReply>
}
