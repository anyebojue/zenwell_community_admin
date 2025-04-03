import { Page } from '../../pageModel'

export interface WorkflowReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  flowName?: string
  describle?: string
  skipLevel?: string
  communityId?: string
  bId?: string
  storeId?: string
  statusCd?: string
  flowType?: string
  processDefinitionKey?: string
  startNodeFinish?: string
}

export interface WorkflowParams {
  id?: string
  flowName?: string
  describle?: string
  skipLevel?: string
  communityId?: string
  bId?: string
  storeId?: string
  statusCd?: string
  flowType?: string
  processDefinitionKey?: string
  startNodeFinish?: string
  startTime?: string
  endTime?: string
}

export interface FindWorkflowReply {
  page: Page
  list: Array<WorkflowReply>
}
