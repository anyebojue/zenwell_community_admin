import { Page } from '../../pageModel'

export interface CarInoutDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  inoutId?: string
  communityId?: string
  machineId?: string
  machineCode?: string
  carInout?: string
  carNum?: string
  statusCd?: string
  paId?: string
  remark?: string
  stateCd?: string
  carType?: string
  carTypeName?: string
  photoJpg?: string
}

export interface CarInoutDetailParams {
  id?: string
  inoutId?: string
  communityId?: string
  machineId?: string
  machineCode?: string
  carInout?: string
  carNum?: string
  statusCd?: string
  paId?: string
  remark?: string
  stateCd?: string
  carType?: string
  carTypeName?: string
  photoJpg?: string
}

export interface FindCarInoutDetailReply {
  page: Page
  list: Array<CarInoutDetailReply>
}
