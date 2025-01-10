import { Page } from '../pageModel'
import { EmployeesReply } from '../platform/employeesModel'
import { RepairSettingReply } from './repairSettingModel'

export interface RepairStaffReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: number // 数据状态
  remark?: string // 备注
  repairSettingId?: string // 报修设置ID
  staffId?: string // 员工ID
  staffName?: string // 员工名称
  communityId?: string // 小区分片ID
  statusCd?: number // 状态 99 在线 88 离线
  user?: EmployeesReply
  repairSetting?: RepairSettingReply
}

export interface RepairStaffParams {
  id?: string
  status?: number // 数据状态
  remark?: string // 备注
  repairSettingId?: string // 报修设置ID
  staffId?: string // 员工ID
  staffName?: string // 员工名称
  communityId?: string // 小区分片ID
  statusCd?: number // 状态 99 在线 88 离线
}

export interface FindRepairStaffReply {
  page: Page
  list: Array<RepairStaffReply>
}
