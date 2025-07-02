import { Page } from '../../pageModel'

export interface FeeFormulaReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string //
  formulaType?: string // 计算公式
  formulaValue?: string // 公式
  formulaDesc?: string // 公式描述
  communityId?: string // 小区ID
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  price?: number // 单价
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
}

export interface FeeFormulaParams {
  id?: string
  name?: string //
  formulaType?: string // 计算公式
  formulaValue?: string // 公式
  formulaDesc?: string // 公式描述
  communityId?: string // 小区ID
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  price?: number // 单价
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
}

export interface FindFeeFormulaReply {
  page: Page
  list: Array<FeeFormulaReply>
}
