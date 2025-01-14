import { Page } from '../pageModel'
import { RepairSettingReply } from './repairSettingModel'

interface RepairLogReply {
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
  repairLog?: RepairLogReply[]
  image?: {
    content?: string
    picBefore?: string
    picAfter?: string
  }
}

export interface RepairPoolParams {
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
}

export interface FindRepairPoolReply {
  page: Page
  list: Array<RepairPoolReply>
}
