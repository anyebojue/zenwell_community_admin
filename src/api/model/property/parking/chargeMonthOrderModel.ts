import { Page } from '../../pageModel'

export interface ChargeMonthOrderReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  cardId?: string
  personName?: string
  personTel?: string
  communityId?: string
  primeRate?: string
  receivableAmount?: string
  receivedAmount?: string
  startTime?: string
  endTime?: string
  statusCd?: string
  remark?: string
}

export interface ChargeMonthOrderParams {
  id?: string
  cardId?: string
  personName?: string
  personTel?: string
  communityId?: string
  primeRate?: string
  receivableAmount?: string
  receivedAmount?: string
  startTime?: string
  endTime?: string
  statusCd?: string
  remark?: string
}

export interface FindChargeMonthOrderReply {
  page: Page
  list: Array<ChargeMonthOrderReply>
}
