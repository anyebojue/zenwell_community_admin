import { Page } from '../../pageModel'

export interface ParkingSpaceInfoReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  num?: string
  paId?: string
  stateCd?: string
  area?: number
  remark?: string
  statusCd?: string
  parkingType?: string
}

export interface ParkingSpaceInfoParams {
  id?: string
  communityId?: string
  num?: string
  paId?: string
  stateCd?: string
  area?: number
  remark?: string
  statusCd?: string
  parkingType?: string
}

export interface FindParkingSpaceInfoReply {
  page: Page
  list: Array<ParkingSpaceInfoReply>
}
