import { Page } from '../../pageModel'
import { ResourceStoreSpecificationReply } from './resourceStoreSpecificationModel'
import { StorehouseReply } from './storehouseModel'

export interface ProcurementResourceStore {
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
  resourceStoreSpecification?: ResourceStoreSpecificationReply
  storehouse?: StorehouseReply
}

export interface PurchaseApplyDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  userId?: string
  userName?: string
  endUserName?: string
  resOrderType?: string
  storeId?: string
  rstId?: string
  resName?: string
  rssId?: string
  isFixed?: string
  rsId?: string
  shId?: string
  warehousingWay?: string
  quantity?: string
  purchaseQuantity?: string
  price?: number
  totalPrice?: number
  purchaseRemark?: string
  statusCd?: string
  procurementResourceStore?: ProcurementResourceStore[]
}

export interface PurchaseApplyDetailParams {
  id?: string
  communityId?: string
  userId?: string
  userName?: string
  endUserName?: string
  resOrderType?: string
  storeId?: string
  rstId?: string
  resName?: string
  rssId?: string
  isFixed?: string
  rsId?: string
  shId?: string
  warehousingWay?: string
  quantity?: string
  purchaseQuantity?: string
  price?: number
  totalPrice?: number
  purchaseRemark?: string
  statusCd?: string
  procurementResourceStore?: ProcurementResourceStore[]
  startTime?: string
  endTime?: string
}

export interface FindPurchaseApplyDetailReply {
  page: Page
  list: Array<PurchaseApplyDetailReply>
  exportUrl: string
}
