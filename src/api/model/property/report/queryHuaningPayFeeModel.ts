import { Page } from '../../pageModel'

export interface QueryHuaningPayFeeReply {
  td: {
    list: {
      key: string
      name: string
      val: string
    }[]
  }[]
  th: {
    key: string
    name: string
  }[]
}

export interface QueryHuaningPayFeeParams {
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

export interface FindQueryHuaningPayFeeReply {
  page: Page
  list: Array<QueryHuaningPayFeeReply>
}
