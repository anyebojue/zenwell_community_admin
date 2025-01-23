import { Page } from '../pageModel'

export interface OwnerInvoiceReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  ownerId?: string // 业主ID
  ownerName?: string // 业主名称
  invoiceType?: string // 发票类型 1001 个人 2002 企业
  communityId?: string // 小区ID
  invoiceName?: string // 发票名头
  invoiceNum?: string // 纳税人识别号
  invoiceAddress?: string // 地址
  invoiceLink?: string // 电话
  invoiceAccount?: string // 开户行
  remark?: string // 备注
  status?: number // 状态 0 无效 1 有效
}

export interface OwnerInvoiceParams {
  id?: string
  ownerId?: string // 业主ID
  ownerName?: string // 业主名称
  invoiceType?: string // 发票类型 1001 个人 2002 企业
  communityId?: string // 小区ID
  invoiceName?: string // 发票名头
  invoiceNum?: string // 纳税人识别号
  invoiceAddress?: string // 地址
  invoiceLink?: string // 电话
  invoiceAccount?: string // 开户行
  remark?: string // 备注
  status?: number // 状态 0 无效 1 有效
}

export interface FindOwnerInvoiceReply {
  page: Page
  list: Array<OwnerInvoiceReply>
}
