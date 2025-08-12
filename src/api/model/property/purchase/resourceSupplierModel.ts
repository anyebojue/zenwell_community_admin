import { Page } from '../../pageModel'

export interface ResourceSupplierReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  supplierName?: string
  address?: string
  tel?: string
  contactName?: string
  accountBank?: string
  bankAccountNumber?: string
  statusCd?: string
  createUserId?: string
  createUserName?: string
  storeId?: string
  remark?: string
}

export interface ResourceSupplierParams {
  id?: string
  supplierName?: string
  address?: string
  tel?: string
  contactName?: string
  accountBank?: string
  bankAccountNumber?: string
  statusCd?: string
  createUserId?: string
  createUserName?: string
  storeId?: string
  remark?: string
}

export interface FindResourceSupplierReply {
  page: Page
  list: Array<ResourceSupplierReply>
}
