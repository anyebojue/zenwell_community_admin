import { Page } from '../../pageModel'

export interface ApplyRoomDiscountRecordReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  ardId?: string // 空置房申请id
  communityId?: string // 小区id
  statusCd?: string // 数据状态，0, 在用 1失效
  createUserId?: string // 创建用户的id
  createUserName?: string // 创建人
  remark?: string // 备注
  isTrue?: string // 是否违规  true 是   false 否
  stateCd?: string // 审核状态: 1申请验房2验房通过3验房不通过 4审批通过5审批不通过
  img?: string // 图片
  video?: string // 视频
}

export interface ApplyRoomDiscountRecordParams {
  id?: string
  ardId?: string // 空置房申请id
  communityId?: string // 小区id
  statusCd?: string // 数据状态，0, 在用 1失效
  createUserId?: string // 创建用户的id
  createUserName?: string // 创建人
  remark?: string // 备注
  isTrue?: string // 是否违规  true 是   false 否
  stateCd?: string // 审核状态: 1申请验房2验房通过3验房不通过 4审批通过5审批不通过
  img?: string // 图片
  video?: string // 视频
  roomId?: string
}

export interface FindApplyRoomDiscountRecordReply {
  page: Page
  list: Array<ApplyRoomDiscountRecordReply>
}
