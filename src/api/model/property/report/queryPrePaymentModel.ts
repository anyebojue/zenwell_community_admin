import { Page } from '../../pageModel'

export interface QueryPrePaymentReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  allHisOweReceivedAmount?: string
  configReceivedAmount?: string
  curReceivableAmount?: string
  curReceivedAmount?: string
  endTime?: string
  feeName?: string
  hisOweAmount?: string
  hisOweReceivedAmount?: string
  objName?: string
  oweDay?: string
  ownerName?: string
  page?: string
  payerObjType?: string
  preReceivedAmount?: string
  records?: string
  row?: string
  statusCd?: string
  total?: string
}

export interface QueryPrePaymentParams {
  id?: string
  objName?: string
  configId?: string
  ownerName?: string
  link?: string
  communityId?: string
}

export interface FindQueryPrePaymentReply {
  page: Page
  list: Array<QueryPrePaymentReply>
  exportUrl: string
}
