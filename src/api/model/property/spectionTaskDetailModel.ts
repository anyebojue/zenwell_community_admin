import { Page } from '../pageModel'

export interface SpectionTaskDetailReply {
  id?: string
  communityId?: string // 小区ID
  taskId?: string // 任务ID
  inspectionId?: string // 巡检点ID
  inspectionName?: string // 巡检点名称
  stateCd?: number // 巡检点状态 0 未开始 1 进行中 2 已完成
  status?: number // 数据状态 0 在用 1 失效
  patrolType?: number // 巡检情况 0 正常 1 异常
  description?: string // 巡检说明
  longitude?: string // 经度
  latitude?: string // 纬度
  inspectionState?: number // 签到状态 0 未签到 1 已签到
  inspectionTime?: string // 巡检点打卡时间
  pointStartTime?: string // 巡检点开始时间
  pointEndTime?: string // 巡检点结束时间
  sortNumber?: number // 排序
  actUserId?: string // 实际巡检人员ID
  actUserName?: string // 实际巡检人员姓名
  sendFlag?: number // 巡检提醒标记 0 未发送 1 已发送
  remark?: string // 备注
  createdAt?: string
}

export interface SpectionTaskDetailParams {
  id?: string
  communityId?: string // 小区ID
  taskId?: string // 任务ID
  inspectionId?: string // 巡检点ID
  inspectionName?: string // 巡检点名称
  stateCd?: number // 巡检点状态 0 未开始 1 进行中 2 已完成
  status?: number // 数据状态 0 在用 1 失效
  patrolType?: number // 巡检情况 0 正常 1 异常
  description?: string // 巡检说明
  longitude?: string // 经度
  latitude?: string // 纬度
  inspectionState?: number // 签到状态 0 未签到 1 已签到
  inspectionTime?: string // 巡检点打卡时间
  pointStartTime?: string // 巡检点开始时间
  pointEndTime?: string // 巡检点结束时间
  sortNumber?: number // 排序
  actUserId?: string // 实际巡检人员ID
  actUserName?: string // 实际巡检人员姓名
  sendFlag?: number // 巡检提醒标记 0 未发送 1 已发送
  remark?: string // 备注
}

export interface FindSpectionTaskDetailReply {
  page: Page
  list: Array<SpectionTaskDetailReply>
}
