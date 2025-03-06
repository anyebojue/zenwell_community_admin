import { Page } from '../../pageModel'

export interface RepairList {
  page?: number
  records?: number
  row?: number
  staffId?: string
  staffName?: string
  state?: string
}

export interface Rep {
  chargebackNumber?: string
  dealNumber?: string
  dispatchNumber?: string
  returnNumber?: string
  statementNumber?: string
  statusCd?: string
  transferOrderNumber?: string
}

export interface SumTotal {
  chargebackNumber?: string
  dealNumber?: string
  dispatchNumber?: string
  returnNumber?: string
  statementNumber?: string
  statusCd?: string
  transferOrderNumber?: string
}

export interface QueryRepairReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  chargebackAmount?: string
  chargebackNumber?: string
  dealAmount?: string
  dealNumber?: string
  dispatchAmount?: string
  dispatchNumber?: string
  page?: number
  records?: number
  returnAmount?: string
  returnNumber?: string
  row?: number
  score?: string
  staffId?: string
  staffName?: string
  statementAmount?: string
  statementNumber?: string
  statusCd?: string
  total?: number
  transferOrderAmount?: string
  transferOrderNumber?: string
  repairList?: Array<RepairList>
}

export interface QueryRepairParams {
  id?: string
  communityId?: string
  isExport?: boolean
  staffId?: string
  staffName?: string
  state?: string
  stateName?: string
  amount?: string
  beginStartTime?: string
  beginEndTime?: string
  finishStartTime?: string
  finishEndTime?: string
  dealNumber?: string
  dispatchNumber?: string
  transferOrderNumber?: string
  chargebackNumber?: string
  statementNumber?: string
  returnNumber?: string
  score?: string
}

export interface FindQueryRepairReply {
  page: Page
  list: Array<QueryRepairReply>
  exportUrl: string
  rep: Rep
  sumTotal: SumTotal[]
}
