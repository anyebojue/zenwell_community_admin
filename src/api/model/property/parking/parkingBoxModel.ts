import { Page } from '../../pageModel'
import { ParkingAreaReply } from './parkingAreaModel'

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
  paId?: string
  parkingArea?: ParkingAreaReply
}

export interface ParkingBoxParams {
  id?: string
  boxName?: string
  communityId?: string
  tempCarIn?: string
  fee?: string
  blueCarIn?: string
  yelowCarIn?: string
  remark?: string
  statusCd?: string
  paId?: string
}

export interface FindParkingBoxReply {
  page: Page
  list: Array<ParkingBoxReply>
}
