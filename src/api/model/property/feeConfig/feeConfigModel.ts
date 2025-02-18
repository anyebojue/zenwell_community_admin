import { Page } from '../../pageModel'

export interface FeeConfigReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string // 名称
  communityId?: string // 小区ID
  feeTypeCd?: string // 费用类型，物业费，停车费
  squarePrice?: number // 每平米收取的单价
  additionalAmount?: number // 附加费用
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  isDefault?: string // 默认费用 只能修改 不能做删除 T 标识是默认 F 不是默认
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  feeFlag?: string // 费用标识 1003006 为周期性费用 2006012 为一次性费用
  feeName?: string // 费用项名称
  computingFormula?: string // 计算公式 1001 面积*单价+附加费 2002 固定费用
  billType?: string // 出账类型
  paymentCycle?: string // 缴费周期
  paymentCd?: string // 付费类型
  computingFormulaText?: string // 自定义公式内容
  deductFrom?: string // 是否账户抵扣, Y 默认,是 N 否
  payOnline?: string // 是否线上缴费 Y 是 N 否
  scale?: string // 进位 1表示四舍五入后保留小数点后两位；2表示四舍五入后保留小数点后一位；3表示向上取整；4 表示向下取整；5表示 四舍五入后取整 其他情况默认四舍五入后保留小数点后两位。
  decimalPlace?: number // 小数点位数，0-4位
  units?: string // 单位 默认元
  prepaymentPeriod?: string // 预付期，单位为天
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
  feeConfigType?: FeeConfigReply
}

export interface FeeConfigParams {
  id?: string
  name?: string // 名称
  communityId?: string // 小区ID
  feeTypeCd?: string // 费用类型，物业费，停车费
  squarePrice?: number // 每平米收取的单价
  additionalAmount?: number // 附加费用
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  isDefault?: string // 默认费用 只能修改 不能做删除 T 标识是默认 F 不是默认
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  feeFlag?: string // 费用标识 1003006 为周期性费用 2006012 为一次性费用
  feeName?: string // 费用项名称
  computingFormula?: string // 计算公式 1001 面积*单价+附加费 2002 固定费用
  billType?: string // 出账类型
  paymentCycle?: string // 缴费周期
  paymentCd?: string // 付费类型
  computingFormulaText?: string // 自定义公式内容
  deductFrom?: string // 是否账户抵扣, Y 默认,是 N 否
  payOnline?: string // 是否线上缴费 Y 是 N 否
  scale?: string // 进位 1表示四舍五入后保留小数点后两位；2表示四舍五入后保留小数点后一位；3表示向上取整；4 表示向下取整；5表示 四舍五入后取整 其他情况默认四舍五入后保留小数点后两位。
  decimalPlace?: number // 小数点位数，0-4位
  units?: string // 单位 默认元
  prepaymentPeriod?: string // 预付期，单位为天
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
}

export interface FindFeeConfigReply {
  page: Page
  list: Array<FeeConfigReply>
}
