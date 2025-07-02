import { Page } from '../../pageModel'

export interface StaffReply {
  id?: string
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  inspectionPlanId?: string // 巡检计划ID
  communityId?: string // 小区ID
  staffId?: string // 巡检人ID
  staffName?: string // 巡检人名称
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  operate?: number // 数据状态 0 添加 1 修改 2 删除
  status?: number // 状态 0 禁用 1 启用
}

export interface StaffParams {
  id?: string
  inspectionPlanId?: string // 巡检计划ID
  communityId?: string // 小区ID
  staffId?: string // 巡检人ID
  staffName?: string // 巡检人名称
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  operate?: number // 数据状态 0 添加 1 修改 2 删除
  status?: number // 状态 0 禁用 1 启用
}

export interface FindStaffReply {
  page: Page
  list: Array<StaffReply>
}
