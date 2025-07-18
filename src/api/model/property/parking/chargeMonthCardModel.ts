import { Page } from '../../pageModel'
import { ParkingAreaReply } from './parkingAreaModel'

export interface ChargeMonthCardReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  cardName?: string
  cardMonth?: number
  cardPrice?: number
  dayHours?: string
  communityId?: string
  statusCd?: string
  remark?: string
  paId?: string
  parkingArea?: ParkingAreaReply
}

export interface ChargeMonthCardParams {
  id?: string
  cardName?: string
  cardMonth?: number
  cardPrice?: number
  dayHours?: string
  communityId?: string
  statusCd?: string
  remark?: string
  startTime?: string
  endTime?: string
  paId?: string
}

export interface FindChargeMonthCardReply {
  page: Page
  list: Array<ChargeMonthCardReply>
}
