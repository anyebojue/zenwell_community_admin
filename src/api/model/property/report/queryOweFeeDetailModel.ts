import { Page } from '../../pageModel'

export interface QueryOweFeeDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  allHisOweReceivedAmount?: string
  allOweAmount?: string
  builtUpArea?: string
  configReceivedAmount?: string
  curReceivableAmount?: string
  curReceivedAmount?: string
  deadlineTime?: string
  feeCreateTime?: string
  feeName?: string
  hisOweAmount?: string
  hisOweReceivedAmount?: string
  objName?: string
  oweAmount?: string
  oweDay?: string
  ownerName?: string
  page?: string
  preReceivedAmount?: string
  records?: string
  row?: string
  statusCd?: string
  total?: string
  updateTime?: string
}

export interface QueryOweFeeDetailParams {
  id?: string
  communityId?: string
  isExport?: string
  startTime?: string
  endTime?: string
  unitId?: string
  objName?: string
  roomNum?: string
  floorName?: string
  floorId?: string
}

export interface FindQueryOweFeeDetailReply {
  page: Page
  list: Array<QueryOweFeeDetailReply>
  exportUrl: string
  totalPreferentialAmount: string
  allOweAmount: string
}
