import { Page } from '../../pageModel'

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
}

export interface CarInoutParams {
  id?: string
  communityId?: string
  carNum?: string
  stateCd?: string
  paId?: string
  inTime?: string
  isIn?: string
  carType?: string
  startTime?: string
  endTime?: string
}

export interface FindCarInoutReply {
  page: Page
  list: Array<CarInoutReply>
}
