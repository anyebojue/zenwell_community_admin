import { Page } from './pageModel'

export interface DictReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: number
  remark?: string
  type?: string
  name?: string
  value?: string
  desc?: string
  tableDesc?: string
  columnDesc?: string
}

export interface DictParams {
  id?: string
  status?: number
  remark?: string
  type?: string
  name?: string
  value?: string
  desc?: string
  tableDesc?: string
  columnDesc?: string
}

export interface FindDictReply {
  page: Page
  list: Array<DictReply>
}
