import { Page } from '../../pageModel'

export interface ReleaseTypeReply {
  id?: string
  typeName?: string // 类型名称
  flowId?: string // 流程ID
  flowName?: string // 流程名称
  remark?: string // 备注
  communityId?: string // 小区ID
  status?: number // 数据状态，详细参考 t_dict 表，0 在用 1 失效
}

export interface ReleaseTypeParams {
  id?: string
  typeName?: string // 类型名称
  flowId?: string // 流程ID
  flowName?: string // 流程名称
  remark?: string // 备注
  communityId?: string // 小区ID
  status?: number // 数据状态，详细参考 t_dict 表，0 在用 1 失效
}

export interface FindReleaseTypeReply {
  page: Page
  list: Array<ReleaseTypeReply>
}
