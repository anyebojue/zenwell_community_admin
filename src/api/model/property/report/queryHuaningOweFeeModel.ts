import { Page } from '../../pageModel'

export interface QueryHuaningOweFeeReply {
  allHisOweReceivedAmount?: string
  configReceivedAmount?: string
  curOweAmount?: string
  curReceivableAmount?: string
  curReceivedAmount?: string
  floorNum?: string
  hisOweAmount?: string
  hisOweReceivedAmount?: string
  oweAmount?: string
  oweDay?: number
  preOweAmount?: string
  preReceivedAmount?: string
  records?: number
  row?: number
  statusCd?: string
  total?: number
}

export interface QueryHuaningOweFeeParams {
  communityId?: string
  isExport?: boolean
  configId?: string
  feeTypeCd?: string
  floorNum?: string
  year?: string
  month?: string
  row?: string
  objType?: string
}

export interface FindQueryHuaningOweFeeReply {
  page: Page
  list: Array<QueryHuaningOweFeeReply>
  exportUrl: string
}
