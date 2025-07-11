import { Page } from '../../pageModel'

export interface MeterWaterReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  meterType?: string // 抄表类型
  objType?: string // 类型 1001 房屋 2002 车位
  objId?: string // 对象ID，1001 是房屋 2002 是车位
  preDegrees?: string // 上期度数
  curDegrees?: string // 本期度数
  preReadingTime?: string // 上期读表时间
  curReadingTime?: string // 本期读表时间
  communityId?: string //
  statusCd?: string // 数据状态，详细参考c_status表，0, 在用 1失效
  feeId?: string // 费用ID
  feeTypeCd?: string
  configId?: string
  objName?: string // 对象名称
  price?: number // 抄表单价
  status?: number //
  remark?: string // 度表署名
}

export interface MeterWaterParams {
  id?: string
  name?: string
  meterType?: string // 抄表类型
  objType?: string // 类型 1001 房屋 2002 车位
  objId?: string // 对象ID，1001 是房屋 2002 是车位
  preDegrees?: string // 上期度数
  curDegrees?: string // 本期度数
  preReadingTime?: string // 上期读表时间
  curReadingTime?: string // 本期读表时间
  communityId?: string //
  statusCd?: string // 数据状态，详细参考c_status表，0, 在用 1失效
  feeId?: string // 费用ID
  feeTypeCd?: string
  configId?: string
  objName?: string // 对象名称
  price?: number // 抄表单价
  status?: number //
  remark?: string // 度表署名
}

export interface FindMeterWaterReply {
  page: Page
  list: Array<MeterWaterReply>
}
