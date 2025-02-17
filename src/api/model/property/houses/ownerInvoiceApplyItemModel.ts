import { Page } from '../pageModel'

export interface OwnerInvoiceApplyItemReply {
  id?: string
  applyId?: string // 申请ID
  itemType?: string // 类型 1001 账户预存 2002 物业缴费
  itemName?: string // 名称 账户时 账户名称  物业缴费时 费用名称
  itemObjId?: string // 对象ID
  itemAmount?: string // 金额
  communityId?: string // 小区ID
  payTime?: string // 缴费时间
  status?: number // 状态 0 无效 1 有效
  remark?: string // 备注
}

export interface OwnerInvoiceApplyItemParams {
  id?: string
  applyId?: string // 申请ID
  itemType?: string // 类型 1001 账户预存 2002 物业缴费
  itemName?: string // 名称 账户时 账户名称  物业缴费时 费用名称
  itemObjId?: string // 对象ID
  itemAmount?: string // 金额
  communityId?: string // 小区ID
  payTime?: string // 缴费时间
  status?: number // 状态 0 无效 1 有效
  remark?: string // 备注
}

export interface FindOwnerInvoiceApplyItemReply {
  page: Page
  list: Array<OwnerInvoiceApplyItemReply>
}
