import { Page } from '../../pageModel'

export interface ParkingBoxReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  boxName?: string
  communityId?: string
  tempCarIn?: string
  fee?: string
  blueCarIn?: string
  yelowCarIn?: string
  remark?: string
  statusCd?: string
}

export interface ParkingBoxParams {
  id?: string
  boxName?: string
  communityId?: string
  tempCarIn?: string
  remark?: string
}

export interface FindParkingBoxReply {
  page: Page
  list: Array<ParkingBoxReply>
}
