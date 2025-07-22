import { Page } from '../../pageModel'
import { ParkingBoxReply } from './parkingBoxModel'

export interface MachineReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  machineCode?: string
  machineVersion?: string
  machineTypeCd?: string
  communityId?: string
  machineName?: string
  authCode?: string
  machineIp?: string
  machineMac?: string
  statusCd?: string
  locationTypeCd?: string
  locationObjId?: string
  stateCd?: string
  direction?: string
  heartbeatTime?: string
  typeId?: string
  manufacturer?: string
  video?: string
  pbId?: string
  parkingBox?: ParkingBoxReply
}

export interface MachineParams {
  id?: string
  machineCode?: string
  machineVersion?: string
  machineTypeCd?: string
  communityId?: string
  machineName?: string
  authCode?: string
  machineIp?: string
  machineMac?: string
  statusCd?: string
  locationTypeCd?: string
  locationObjId?: string
  stateCd?: string
  direction?: string
  heartbeatTime?: string
  typeId?: string
  startTime?: string
  endTime?: string
  manufacturer?: string
  video?: string
  pbId?: string
}

export interface FindMachineReply {
  page: Page
  list: Array<MachineReply>
}
