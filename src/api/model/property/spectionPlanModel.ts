import { Page } from '../pageModel'

export interface SpectionPlanReply {
  id?: string
  inspectionPlanName?: string // 巡检计划名称
  inspectionRouteId?: string // 巡检路线ID
  communityId?: string // 小区ID
  startDate?: string // 开始日期
  endDate?: string // 结束日期
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  inspectionPlanPeriod?: number // 执行周期 0 每日 1 每周 2 每月等
  signType?: number // 签到方式 0 手动 1 自动
  stateCd?: number // 当前状态 0 未开始 1 进行中 2 已完成
  remark?: string // 备注说明
  createUserId?: string // 制定人员ID
  createUserName?: string // 制定人员姓名
  beforeTime?: number // 任务提前时间（分钟）
  inspectionMonth?: number // 指定月份，0 表示不限
  inspectionDay?: number // 指定天数，0 表示不限
  inspectionWorkday?: number // 指定工作日，0 表示不限
  canReexamine?: number // 允许补检 0 不允许 1 允许
  operate?: number // 数据状态 0 添加 1 修改 2 删除
  status?: string // 状态 0 禁用 1 启用
  createdAt?: string
}

export interface SpectionPlanParams {
  id?: string
  inspectionPlanName?: string // 巡检计划名称
  inspectionRouteId?: string // 巡检路线ID
  communityId?: string // 小区ID
  startDate?: string // 开始日期
  endDate?: string // 结束日期
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  inspectionPlanPeriod?: number // 执行周期 0 每日 1 每周 2 每月等
  signType?: number // 签到方式 0 手动 1 自动
  stateCd?: number // 当前状态 0 未开始 1 进行中 2 已完成
  remark?: string // 备注说明
  createUserId?: string // 制定人员ID
  createUserName?: string // 制定人员姓名
  beforeTime?: number // 任务提前时间（分钟）
  inspectionMonth?: number // 指定月份，0 表示不限
  inspectionDay?: number // 指定天数，0 表示不限
  inspectionWorkday?: number // 指定工作日，0 表示不限
  canReexamine?: number // 允许补检 0 不允许 1 允许
  operate?: number // 数据状态 0 添加 1 修改 2 删除
  status?: string // 状态 0 禁用 1 启用
  staffName?: string // 巡检人
}

export interface FindSpectionPlanReply {
  page: Page
  list: Array<SpectionPlanReply>
}
