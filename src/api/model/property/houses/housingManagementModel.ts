import { Page } from '../../pageModel'
import { UnitReply } from './unitModel'

export interface HousingManagementReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string // 楼栋名称
  status?: number // 状态
  remark?: string // 备注
  floorNum?: string // 楼栋编号
  userId?: string // 用户ID
  communityId?: string // 小区ID
  floorArea?: string // 建筑面积
  sort?: number // 排序
  unit?: UnitReply[] // 单元
}

export interface HousingManagementParams {
  id?: string
  name?: string // 楼栋名称
  status?: number // 状态
  remark?: string // 备注
  floorNum?: string // 楼栋编号
  userId?: string // 用户ID
  communityId?: string // 小区ID
  floorArea?: string // 建筑面积
  sort?: number // 排序
}

export interface FindHousingManagementReply {
  page: Page
  list: Array<HousingManagementReply>
}
