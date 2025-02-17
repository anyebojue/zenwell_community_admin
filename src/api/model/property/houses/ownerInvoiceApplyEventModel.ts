import { Page } from '../../pageModel'

export interface OwnerInvoiceApplyEventReply {
  id?: string
  applyId?: string // 申请ID
  eventType?: string // 类型 1001 审核成功 2002 上传 3003 审核失败 4004 领用 5005 登记
  communityId?: string // 小区ID
  createUserId?: string // 操作人ID
  createUserName?: string // 操作人名称
  status?: number // 状态 0 无效 1 有效
  remark?: string // 备注
}

export interface OwnerInvoiceApplyEventParams {
  id?: string
  applyId?: string // 申请ID
  eventType?: string // 类型 1001 审核成功 2002 上传 3003 审核失败 4004 领用 5005 登记
  communityId?: string // 小区ID
  createUserId?: string // 操作人ID
  createUserName?: string // 操作人名称
  status?: number // 状态 0 无效 1 有效
  remark?: string // 备注
}

export interface FindOwnerInvoiceApplyEventReply {
  page: Page
  list: Array<OwnerInvoiceApplyEventReply>
}
