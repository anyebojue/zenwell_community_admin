import { Page } from '../../pageModel'

export interface FeeConfigLogReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string // 收费项目
  feeConfigId?: string // 收费项目ID
  communityId?: string // 小区ID
  beforeContent?: string // 修改前内容
  afterContent?: string // 修改后内容
  createUser?: string // 操作人
  action?: string // 动作
}

export interface FeeConfigLogParams {
  id?: string
  name?: string // 收费项目
  feeConfigId?: string // 费用配置ID
  communityId?: string // 小区ID
  beforeContent?: string // 修改前内容
  afterContent?: string // 修改后内容
  createUser?: string // 修改人
  action?: string // 动作
}

export interface FindFeeConfigLogReply {
  page: Page
  list: Array<FeeConfigLogReply>
}
