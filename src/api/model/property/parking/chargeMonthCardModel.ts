import { Page } from '../../pageModel'

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
}

export interface FindChargeMonthCardReply {
  page: Page
  list: Array<ChargeMonthCardReply>
}
