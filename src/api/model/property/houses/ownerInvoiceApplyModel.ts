import { Page } from '../../pageModel'
import { OwnerInvoiceReply } from './ownerInvoiceModel'

export interface OwnerInvoiceApplyReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  oiId?: string // 业主发票ID
  invoiceType?: string // 发票类型 1001 个人 2002 企业
  ownerName?: string // 业主名称
  applyTel?: string // 申请人电话
  invoiceAmount?: number // 申请金额
  communityId?: string // 小区ID
  createUserId?: string // 用户ID
  createUserName?: string // 申请人
  stateCd?: string // 审核状态 W 待审核 U 待上传 F 审核失败 G 带领用 C 已领用
  remark?: string // 备注
  invoiceCode?: string // 发票编号
  invoiceImg?: string // 发票编号
  status?: number // 记录状态，0 禁用，1 启用
  ownerInvoice?: OwnerInvoiceReply
  invoiceAccount?: string // 电话
  invoiceLink?: string // 地址
}

export interface OwnerInvoiceApplyParams {
  id?: string
  ownerId?: string
  invoiceName?: string
  invoiceNum?: string
  invoiceLink?: string
  invoiceAddress?: string
  oiId?: string // 业主发票ID
  invoiceType?: string // 发票类型 1001 个人 2002 企业
  ownerName?: string // 业主名称
  applyTel?: string // 申请人电话
  invoiceAmount?: number // 申请金额
  communityId?: string // 小区ID
  createUserName?: string // 申请人
  stateCd?: string // 审核状态 W 待审核 U 待上传 F 审核失败 G 带领用 C 已领用
  remark?: string // 备注
  invoiceCode?: string // 发票编号
  invoiceImg?: string // 发票编号
  status?: number // 记录状态，0 禁用，1 启用
}

export interface FindOwnerInvoiceApplyReply {
  page: Page
  list: Array<OwnerInvoiceApplyReply>
}
