import { Page } from '../../pageModel'
import { RepairSettingReply } from './repairSettingModel'

export interface RepairReturnVisitParams {
  id?: string
  communityId?: string
  repairSettingId?: string
  statusCd?: number
  visitType?: number
  context?: string
}

export interface RepairReturnVisitReply {
  id: string
  createdAt: string
  updatedAt: string
  status: number
  remark: string
  repairPoolId: string
  communityId: string
  visitPersonId: string
  visitPersonName: string
  visitType: number
  context: string
  statusCd: number
}

export interface RepairLogReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: number
  remark?: string
  repairSettingId?: string
  repairPoolId?: string
  communityId?: string
  context?: string
  statusCd?: number
  staffId?: string
  staffName?: string
  preStaffId?: string
  preStaffName?: string
  startTime?: string
  endTime?: string
  repairEvent?: string
  preRuId?: string
}

export interface RepairPoolReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: number
  remark?: string
  communityId?: string
  repairSettingId?: string
  repairName?: string
  tel?: string
  context?: string
  statusCd?: number
  repairObjType?: number
  repairObjId?: string
  repairObjName?: string
  appointmentTime?: string
  maintenanceType?: number
  repairChannel?: number
  repairMaterials?: string
  repairFee?: string
  payType?: number
  repairSetting?: RepairSettingReply
  repairReturnVisit?: RepairReturnVisitReply
  repairLog?: RepairLogReply[]
  image?: {
    content?: string
    picBefore?: string
    picAfter?: string
  }
}

export interface RepairPoolParams {
  needForceHand?: number
  id?: string
  status?: number
  remark?: string
  communityId?: string
  repairSettingId?: string
  repairName?: string
  tel?: string
  context?: string
  statusCd?: number
  repairObjType?: number
  repairObjId?: string
  repairObjName?: string
  appointmentTime?: string
  maintenanceType?: number
  repairChannel?: number
  repairMaterials?: string
  repairFee?: string
  payType?: number
  floorId?: string
  unitId?: string
  roomId?: string
  repairType?: string
  startTime?: string
  endTime?: string
  hasReturnVisit?: string
  returnVisitFlag?: number
}

export interface FindRepairPoolReply {
  page: Page
  list: Array<RepairPoolReply>
}
