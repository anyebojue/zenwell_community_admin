import { Page } from '../../pageModel'

export interface StorehouseReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  shName?: string
  shDesc?: string
  shType?: string
  shObjId?: string
  storeId?: string
  statusCd?: string
  isShow?: string
}

export interface StorehouseParams {
  id?: string
  shName?: string
  shDesc?: string
  shType?: string
  shObjId?: string
  storeId?: string
  statusCd?: string
  isShow?: string
  startTime?: string
  endTime?: string
}

export interface FindStorehouseReply {
  page: Page
  list: Array<StorehouseReply>
}
