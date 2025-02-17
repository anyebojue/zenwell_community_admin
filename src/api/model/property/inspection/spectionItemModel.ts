import { Page } from '../pageModel'

interface SpectionItemVal {
  itemId?: string // 题目ID
  itemValue?: string // 选项说明
  communityId?: string // 小区ID
  seq?: number // 显示顺序
  status?: number // 数据状态，0 在用, 1 失效, S 保存
  remark?: string // 备注
}

export interface SpectionItemReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  spectionId?: string // 项目编号
  name?: string // 名称
  titleType?: number // 题目类型 1001 单选, 2002 多选, 3003 简答题
  communityId?: string // 小区ID
  seq?: number // 显示顺序
  status?: number // 数据状态，0 在用, 1 失效, S 保存
  remark?: string // 备注
  spectionItemVal?: SpectionItemVal[]
}

export interface SpectionItemParams {
  id?: string
  spectionId?: string // 项目编号
  name?: string // 名称
  titleType?: number // 题目类型 1001 单选, 2002 多选, 3003 简答题
  communityId?: string // 小区ID
  seq?: number // 显示顺序
  status?: number // 数据状态，0 在用, 1 失效, S 保存
  remark?: string // 备注
  spectionItemVal?: SpectionItemVal[]
}

export interface FindSpectionItemReply {
  page: Page
  list: Array<SpectionItemReply>
}
