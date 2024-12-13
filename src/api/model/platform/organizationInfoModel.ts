import { Page } from '../pageModel'
import { EmployeesReply } from './employeesModel'

export interface OrgUserReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string // 员工姓名
  orgId?: string // 组织ID
  userId?: string // 员工ID
  orgs?: []
  users?: EmployeesReply // 员工信息
}

export interface OrganizationInfoReply {
  id?: string
  name?: string // 组织名称
  description?: string // 组织描述
  pId?: string // 上级ID 0是顶级ID
  plate?: string // 平台  0 物业 1平台 2开发
  status?: number // 状态：1 启用 0 停用
  remark?: string // 备注
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  children?: OrganizationInfoReply[]
}

export interface OrganizationInfoParams {
  id?: string
  name?: string // 组织名称
  description?: string // 组织描述
  pId?: string // 上级ID 0是顶级ID
  plate?: string // 平台  0 物业 1平台 2开发
}

export interface FindOrgUserReply {
  page: Page
  list: Array<OrgUserReply>
}

export interface FindOrganizationInfoReply {
  page: Page
  list: Array<OrganizationInfoReply>
}
