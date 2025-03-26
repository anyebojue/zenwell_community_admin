import { Page } from '../../pageModel'

export interface ParkingAreaReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  communityId?: string
  num?: string
  typeCd?: string
  remark?: string
  statusCd?: string
}

export interface ParkingAreaParams {
  id?: string
  communityId?: string
  num?: string
  name?: string
  typeCd?: string
  remark?: string
}

export interface FindParkingAreaReply {
  page: Page
  list: Array<ParkingAreaReply>
}
