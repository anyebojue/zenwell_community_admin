import { Page } from '../pageModel'
import { SpectionPlanReply } from './spectionPlanModel'

export interface SpectionTaskReply {
  actInsTime?: string // 实际巡检时间
  actUserId?: string // 实际巡检人员ID
  actUserName?: string // 实际巡检人员姓名
  communityId?: string // 小区ID
  createdAt?: string
  id?: string
  inspectionPlanId?: string // 计划ID
  ipStaffId?: string // 巡检人ID
  originalPlanUserId?: string // 原计划巡检人ID
  originalPlanUserName?: string // 原计划巡检人姓名
  planEndTime?: string // 计划巡检结束时间
  planInsTime?: string // 计划巡检时间
  planUserId?: string // 计划巡检人员ID
  planUserName?: string // 计划巡检人员姓名
  remark?: string // 备注
  signType?: string // 实际巡检方式
  spectionPlan?: SpectionPlanReply
  stateCd?: number // 巡检状态 0 未开始 1 进行中 2 已完成
  status?: number // 数据状态，0 在用, 1 失效
  taskType?: number // 任务类型 0 日常巡检任务 1 流转巡检任务
  transferDesc?: string // 转移说明
  updatedAt?: string
}

export interface SpectionTaskParams {
  id?: string
  communityId?: string // 小区ID
  inspectionPlanId?: string // 计划ID
  planInsTime?: string // 计划巡检时间
  actInsTime?: string // 实际巡检时间
  planUserId?: string // 计划巡检人员ID
  planUserName?: string // 计划巡检人员姓名
  actUserId?: string // 实际巡检人员ID
  actUserName?: string // 实际巡检人员姓名
  signType?: string // 实际巡检方式
  stateCd?: number // 巡检状态 0 未开始 1 进行中 2 已完成
  ipStaffId?: string // 巡检人ID
  originalPlanUserId?: string // 原计划巡检人ID
  originalPlanUserName?: string // 原计划巡检人姓名
  transferDesc?: string // 转移说明
  taskType?: number // 任务类型 0 日常巡检任务 1 流转巡检任务
  planEndTime?: string // 计划巡检结束时间
  remark?: string // 备注
  status?: number // 数据状态，0 在用, 1 失效
  name?: string
  startTime?: string
  endTime?: string
}

export interface FindSpectionTaskReply {
  page: Page
  list: Array<SpectionTaskReply>
}
