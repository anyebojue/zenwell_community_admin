import { Page } from '../../pageModel'

export interface ProcurementResourceStores {
  id?: string
  storeId?: string
  rstId?: string
  resName?: string
  shId?: string
  rssId?: string
  rsId?: string
  resCode?: string
  isFixed?: string
  averagePrice?: number
  originalStock?: string
  unitCode?: string
  stock?: string
  quantity?: string
  remark?: string
  price?: number
  purchaseQuantity?: string
  purchaseRemark?: string
  communityId?: string
  bpaId?: string
}

export interface BusinessPurchaseApplyReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  storeId?: string
  userId?: string
  userName?: string
  description?: string
  resOrderType?: string
  stateCd?: string
  statusCd?: string
  operate?: string
  endUserName?: string
  endUserTel?: string
  communityId?: string
  procurementResourceStores: ProcurementResourceStores[]
}

export interface BusinessPurchaseApplyParams {
  id?: string
  userName?: string
  stateCd?: string
  isExport?: boolean
}

export interface FindBusinessPurchaseApplyReply {
  page: Page
  list: Array<BusinessPurchaseApplyReply>
  exportUrl: string
}
