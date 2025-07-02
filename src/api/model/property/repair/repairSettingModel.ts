import { Page } from '../../pageModel'

export interface RepairSettingReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: number // 数据状态
  remark?: string // 备注
  repairType?: string // 报修类型
  repairTypeName?: string // 报修类型名称
  repairWay?: number // 派单方式 100 抢单 200 指派 300 轮训
  communityId?: string // 小区分片ID
  overTimeRule?: string // 超时规则
  statusCd?: number // 数据状态 0 默认
  publicArea?: number // 是否为公共区域 0 否 1 是
  payFeeFlag?: number // 是否收费 1 是 0 否
  priceScope?: string // 收费范围，如30元至50元
  returnVisitFlag?: number // 回访标识 1 都不回访 2 已评价不回访 3 都回访
  repairSettingType?: string // 报修设置类型
  isShow?: number // 业主端是否展示 1 是 0 否
}

export interface RepairSettingParams {
  id?: string
  status?: number // 数据状态
  remark?: string // 备注
  repairType?: string // 报修类型
  repairTypeName?: string // 报修类型名称
  repairWay?: number // 派单方式 100 抢单 200 指派 300 轮训
  communityId?: string // 小区分片ID
  overTimeRule?: string // 超时规则
  statusCd?: number // 数据状态 0 默认
  publicArea?: number // 是否为公共区域 0 否 1 是
  payFeeFlag?: number // 是否收费 1 是 0 否
  priceScope?: string // 收费范围，如30元至50元
  returnVisitFlag?: number // 回访标识 1 都不回访 2 已评价不回访 3 都回访
  repairSettingType?: string // 报修设置类型
  isShow?: number // 业主端是否展示 1 是 0 否
}

export interface FindRepairSettingReply {
  page: Page
  list: Array<RepairSettingReply>
}
