import { Page } from '../../pageModel'

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
