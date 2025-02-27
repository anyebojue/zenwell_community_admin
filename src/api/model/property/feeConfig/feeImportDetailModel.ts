import { Page } from '../../pageModel'

export interface FeeImportDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  floorNum?: string // 楼栋编号
  unitNum?: string // 单元编号
  roomNum?: string // 房屋编号
  feeName?: string // 费用名称
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  amount?: number // 总金额
  roomId?: string // 房屋ID
  feeId?: string // 费用ID
  stateCd?: string // 1000 导入成功 2000 导入失败
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  communityId?: string // 小区ID
  importFeeId?: string // 导入费用ID
  remark?: string // 备注
  objId?: string // 对象ID
  objName?: string // 对象名称
  objType?: string // 对象类型 3333 房屋 6666 车位
}

export interface FeeImportDetailParams {
  id?: string
  floorNum?: string // 楼栋编号
  unitNum?: string // 单元编号
  roomNum?: string // 房屋编号
  feeName?: string // 费用名称
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  amount?: number // 总金额
  roomId?: string // 房屋ID
  feeId?: string // 费用ID
  stateCd?: string // 1000 导入成功 2000 导入失败
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  communityId?: string // 小区ID
  importFeeId?: string // 导入费用ID
  remark?: string // 备注
  objId?: string // 对象ID
  objName?: string // 对象名称
  objType?: string // 对象类型 3333 房屋 6666 车位
}

export interface FindFeeImportDetailReply {
  page: Page
  list: Array<FeeImportDetailReply>
}
