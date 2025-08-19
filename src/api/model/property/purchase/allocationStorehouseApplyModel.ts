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

export interface AllocationStorehouseApplyReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  startUserId?: string
  startUserName?: string
  remark?: string
  applyCount?: string
  storeId?: string
  statusCd?: string
  stateCd?: string
  applyType?: string
  communityId?: string
  procurementResourceStore: ProcurementResourceStore[]
}

export interface AllocationStorehouseApplyParams {
  id?: string
  startUserId?: string
  startUserName?: string
  remark?: string
  applyCount?: string
  storeId?: string
  statusCd?: string
  stateCd?: string
  applyType?: string
  communityId?: string
  startTime?: string
  endTime?: string
}

export interface FindAllocationStorehouseApplyReply {
  page: Page
  list: Array<AllocationStorehouseApplyReply>
  exportUrl: string
}
