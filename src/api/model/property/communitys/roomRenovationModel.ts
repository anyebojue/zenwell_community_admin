import { Page } from '../pageModel'

export interface RoomRenovationReply {
  id?: string
  roomId?: string // 房屋ID
  roomName?: string // 房屋名称
  communityId?: string // 小区ID
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  personName?: string // 联系人
  personTel?: string // 联系电话
  statusCd?: number // 数据状态 0 在用 1 失效
  status?: number // 状态 1000 待审核 2000 审核不通过 3000 装修中 4000 待验收 5000 验收成功 6000 验收失败
  isViolation?: number // 是否违规 0 正常 1 违规
  violationDesc?: string // 违规说明
  remark?: string // 备注
  examineRemark?: string // 审核备注
  isPostpone?: number // 是否延期 0 正常 1 延期
  postponeTime?: string // 延期时间
  renovationCompany?: string // 装修单位
  personMain?: string // 装修主要负责人
  personMainTel?: string // 负责人联系方式
  createdAt?: string
}

export interface RoomRenovationParams {
  createdAt?: string
  id?: string
  roomId?: string // 房屋ID
  roomName?: string // 房屋名称
  communityId?: string // 小区ID
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  personName?: string // 联系人
  personTel?: string // 联系电话
  statusCd?: number // 数据状态 0 在用 1 失效
  status?: number // 状态 1000 待审核 2000 审核不通过 3000 装修中 4000 待验收 5000 验收成功 6000 验收失败
  isViolation?: number // 是否违规 0 正常 1 违规
  violationDesc?: string // 违规说明
  remark?: string // 备注
  examineRemark?: string // 审核备注
  isPostpone?: number // 是否延期 0 正常 1 延期
  postponeTime?: string // 延期时间
  renovationCompany?: string // 装修单位
  personMain?: string // 装修主要负责人
  personMainTel?: string // 负责人联系方式
}

export interface FindRoomRenovationReply {
  page: Page
  list: Array<RoomRenovationReply>
}
