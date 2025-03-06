import { Page } from '../../pageModel'

export interface QueryDeadlineFeeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  allHisOweReceivedAmount?: string
  configReceivedAmount?: string
  curReceivableAmount?: string
  curReceivedAmount?: string
  deadlineTime?: string
  feeName?: string
  hisOweAmount?: string
  hisOweReceivedAmount?: string
  objName?: string
  objType?: string
  oweDay?: string
  page?: string
  preReceivedAmount?: string
  records?: string
  row?: string
  statusCd?: string
  total?: string
}

export interface QueryDeadlineFeeParams {
  id?: string
  objName?: string
  configId?: string
  ownerName?: string
  link?: string
  communityId?: string
}

export interface FindQueryDeadlineFeeReply {
  page: Page
  list: Array<QueryDeadlineFeeReply>
  exportUrl: string
}
