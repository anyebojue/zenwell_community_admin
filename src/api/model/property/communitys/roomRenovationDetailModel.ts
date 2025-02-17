import { Page } from '../../pageModel'

export interface RoomRenovationDetailReply {
  id?: string
  rId: string // 装修ID
  communityId: string // 小区ID
  detailType: string // 明细类型 1001 验房
  staffId: string // 验房人ID
  staffName: string // 验房人
  status: number // 状态 1000 验房中 3000 验收成功 4000 验收失败
  remark: string // 验房说明
  statusCd: number // 数据状态 0 在用 1 失效
  createdAt?: string //
  updatedAt?: string //
}

export interface RoomRenovationDetailParams {
  id?: string
  rId?: string // 装修ID
  communityId?: string // 小区ID
  detailType?: string // 明细类型 1001 验房
  staffId?: string // 验房人ID
  staffName?: string // 验房人
  status?: string // 状态 1000 验房中 3000 验收成功 4000 验收失败
  remark?: string // 验房说明
  statusCd?: number // 数据状态 0 在用 1 失效
}

export interface FindRoomRenovationDetailReply {
  page: Page
  list: Array<RoomRenovationDetailReply>
}
