import { Page } from '../../pageModel'

export interface ImportFeeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  feeTypeCd?: string // 费用类型
  communityId?: string // 小区ID
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  remark?: string // 备注
}

export interface ImportFeeParams {
  id?: string
  feeTypeCd?: string // 费用类型
  communityId?: string // 小区ID
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  remark?: string // 备注
}

export interface FindImportFeeReply {
  page: Page
  list: Array<ImportFeeReply>
}
