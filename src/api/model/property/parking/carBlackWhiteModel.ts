import { Page } from '../../pageModel'

export interface CarBlackWhiteReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  blackWhite?: string
  carNum?: string
  startTime?: string
  endTime?: string
  statusCd?: string
  paId?: string
}

export interface CarBlackWhiteParams {
  id?: string
  communityId?: string
  blackWhite?: string
  carNum?: string
  paId?: string
  startTime?: string
  endTime?: string
}

export interface FindCarBlackWhiteReply {
  page: Page
  list: Array<CarBlackWhiteReply>
}
