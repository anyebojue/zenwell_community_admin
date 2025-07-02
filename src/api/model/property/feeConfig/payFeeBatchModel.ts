import { Page } from '../../pageModel'

export interface PayFeeBatchReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string // 小区ID
  createUserId?: string // 创建人ID
  createUserName?: string // 创建人名称
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  stateCd?: string // 状态 2006001正常、2007001申请取消、2008001审核通过、2009001审核失败
  msg?: string // 审核说明
  remark?: string // 备注
}

export interface PayFeeBatchParams {
  id?: string
  communityId?: string // 小区ID
  createUserId?: string // 创建人ID
  createUserName?: string // 创建人名称
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  stateCd?: string // 状态 2006001正常、2007001申请取消、2008001审核通过、2009001审核失败
  msg?: string // 审核说明
  remark?: string // 备注
}

export interface FindPayFeeBatchReply {
  page: Page
  list: Array<PayFeeBatchReply>
}
