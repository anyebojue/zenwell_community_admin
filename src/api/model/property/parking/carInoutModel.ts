import { Page } from '../../pageModel'
import { CarInoutDetailReply } from './carInoutDetailModel'
import { CarInoutPaymentReply } from './carInoutPaymentModel'
import { ParkingAreaReply } from './parkingAreaModel'

export interface CarInoutReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  carNum?: string
  stateCd?: string
  inTime?: string
  outTime?: string
  statusCd?: string
  paId?: string
  carType?: string
  startTime?: string
  endTime?: string
  inputImg?: string
  billingRules?: string
  carInoutDetail?: CarInoutDetailReply
  carInoutPayment?: CarInoutPaymentReply
  parkingArea?: ParkingAreaReply
}

export interface CarInoutParams {
  id?: string
  communityId?: string
  carNum?: string
  stateCd?: string
  inTime?: string
  outTime?: string
  statusCd?: string
  paId?: string
  carType?: string
  startTime?: string
  endTime?: string
  inputImg?: string
  billingRules?: string
}

export interface FindCarInoutReply {
  page: Page
  list: Array<CarInoutReply>
}
