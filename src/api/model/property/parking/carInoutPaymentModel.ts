import { Page } from '../../pageModel'
import { CarInoutReply } from './carInoutModel'

export interface CarInoutPaymentReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  inoutId?: string
  communityId?: string
  paId?: string
  payType?: string
  payCharge?: string
  realCharge?: string
  statusCd?: string
  carInout?: CarInoutReply
}

export interface CarInoutPaymentParams {
  id?: string
  inoutId?: string
  communityId?: string
  paId?: string
  payType?: string
  payCharge?: string
  realCharge?: string
  statusCd?: string
}

export interface FindCarInoutPaymentReply {
  page: Page
  list: Array<CarInoutPaymentReply>
}
