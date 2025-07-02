import { Page } from '../../pageModel'

export interface QueryHuaningOweFeeDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  builtUpArea?: number
  deadlineTime?: string
  endTime?: string
  feeName?: string
  floorNum?: string
  oweAmount?: number
  preOweAmount?: number
  roomName?: string
  curOweAmount?: number
}

export interface QueryHuaningOweFeeDetailParams {
  id?: string
  communityId?: string
  builtUpArea?: number
  floorName?: string
  deadlineTime?: string
  endTime?: string
  feeName?: string
  floorNum?: string
  oweAmount?: number
  preOweAmount?: number
  roomName?: string
  curOweAmount?: number
}

export interface FindQueryHuaningOweFeeDetailReply {
  page: Page
  list: Array<QueryHuaningOweFeeDetailReply>
}
