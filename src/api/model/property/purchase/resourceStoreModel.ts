import { Page } from '../../pageModel'

export interface ResourceStoreReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  storeId?: string
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
  img?: string
}

export interface ResourceStoreParams {
  id?: string
  resName?: string
  resCode?: string
  storeId?: string
  rstId?: string
  unitCode?: string
  isFixed?: string
  rssId?: string
  shId?: string
  price?: number
  warningStock?: number
  miniUnitCode?: number
  miniStock?: string
  outLowPrice?: number
  outHighPrice?: number
  description?: string
  remark?: string
  img?: string
  stock?: string
}

export interface FindResourceStoreReply {
  page: Page
  list: Array<ResourceStoreReply>
}
