import { Page } from '../../pageModel'

export interface ReportOweFeeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  configId?: string // 费用项ID
  configName?: string // 费用项名称
  feeId?: string // 费用ID
  feeName?: string // 费用名称
  amountOwed?: number // 当前欠费金额
  ownerId?: string // 业主ID
  ownerName?: string // 业主名称
  ownerTel?: string // 业主联系电话
  payerObjId?: string // 对象ID
  payerObjName?: string // 付费对象名称 如 1栋1单元1室 或者 1号停车场1号车位
  payerObjType?: string // 付费对象类型 3333 房屋 6666 是车位 9999 合同
  communityId?: string // 小区ID
  endTime?: string // 费用结束时间，当时跑账单时的费用结束时间
  deadlineTime?: string // 截止时间
  floorId?: string
  floorNum?: string
  unitId?: string
  unitNum?: string
}

export interface ReportOweFeeParams {
  id?: string
  configId?: string // 费用项ID
  configName?: string // 费用项名称
  feeId?: string // 费用ID
  feeName?: string // 费用名称
  amountOwed?: number // 当前欠费金额
  ownerId?: string // 业主ID
  ownerName?: string // 业主名称
  ownerTel?: string // 业主联系电话
  payerObjId?: string // 对象ID
  payerObjName?: string // 付费对象名称 如 1栋1单元1室 或者 1号停车场1号车位
  payerObjType?: string // 付费对象类型 3333 房屋 6666 是车位 9999 合同
  communityId?: string // 小区ID
  endTime?: string // 费用结束时间，当时跑账单时的费用结束时间
  deadlineTime?: string // 截止时间
  floorId?: string
  floorNum?: string
  unitId?: string
  unitNum?: string
  roomSubType?: string
}

export interface FindReportOweFeeReply {
  page: Page
  list: Array<ReportOweFeeReply>
  exportUrl: string
  sum: string
  allSum: string
}
