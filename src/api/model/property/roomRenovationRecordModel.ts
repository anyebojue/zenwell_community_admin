import { Page } from '../pageModel'

export interface RoomRenovationRecordReply {
  id?: string
  rId?: string // 装修ID
  communityId?: string // 小区ID
  detailType?: string // 明细类型 1001 验房
  staffId?: string // 验房人ID
  staffName?: string // 验房人
  status?: string // 状态 1000 验房中 3000 验收成功 4000 验收失败
  remark?: string // 验房说明
  statusCd?: number // 数据状态 0 在用 1 失效
  img?: string // 图片
  video?: string // 视频
  createdAt?: string
}

export interface RoomRenovationRecordParams {
  id?: string
  rId?: string // 装修ID
  communityId?: string // 小区ID
  detailType?: string // 明细类型 1001 验房
  staffId?: string // 验房人ID
  staffName?: string // 验房人
  status?: string // 状态 1000 验房中 3000 验收成功 4000 验收失败
  remark?: string // 验房说明
  statusCd?: number // 数据状态 0 在用 1 失效
  img?: string // 图片
  video?: string // 视频
  roomName?: string
  isViolation?: number
}

export interface FindRoomRenovationRecordReply {
  page: Page
  list: Array<RoomRenovationRecordReply>
}
