import { Page } from '../../pageModel'
import { FloorReply } from './floorModel'

export interface UnitReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: string
  remark?: string // 备注
  unitNum?: string // 单元编号
  floor?: FloorReply // 楼栋ID
  floorId?: string // 楼栋ID
  layerCount?: number //总层数
  lift?: number // 电梯 0无 1有
  userId?: string // 用户ID
  unitArea?: string // 建筑面积
}

export interface UnitParams {
  id?: string
  status?: string
  remark?: string // 备注
  unitNum?: string // 单元编号
  floorId?: string // 楼栋ID
  layerCount?: number //总层数
  lift?: number // 电梯 0无 1有
  userId?: string // 用户ID
  unitArea?: string // 建筑面积
}

export interface FindUnitReply {
  page: Page
  list: Array<UnitReply>
}
