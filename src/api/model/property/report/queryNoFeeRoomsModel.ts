import { Page } from '../../pageModel'

export interface QueryNoFeeRoomsReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  floorNum?: string
  page?: number
  records?: number
  roomId?: string
  roomNum?: string
  row?: number
  statusCd?: string
  total?: number
  unitNum?: string
}

export interface QueryNoFeeRoomsParams {
  id?: string
  communityId?: string
  isExport?: boolean
  floorId?: string
  floorNum?: string
  unitId?: string
  unitNum?: string
  roomId?: string
  roomNum?: string
  ownerName?: string
  link?: string
}

export interface FindQueryNoFeeRoomsReply {
  page: Page
  list: Array<QueryNoFeeRoomsReply>
  exportUrl: string
}
