import { Page } from '../../pageModel'

export interface ProcurementResourceStores {
  id: string
  storeId: string
  rstId: string
  resName: string
  rssId: string
  price: number
  stock: string
  unitCode: string
  count: string
  remark: string
  communityId: string
  bpaId: string
}

export interface BusinessPurchaseApplyReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  storeId: ''
  userId: ''
  userName: ''
  description: ''
  resOrderType: ''
  stateCd: ''
  statusCd: ''
  operate: ''
  endUserName: ''
  endUserTel: ''
  communityId: ''
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
