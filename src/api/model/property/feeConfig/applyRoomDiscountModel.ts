import { Page } from '../../pageModel'
import { ApplyRoomDiscountTypeReply } from './applyRoomDiscountTypeModel'
import { FeeDiscountReply } from './feeDiscountModel'

export interface ApplyRoomDiscountReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string // 小区ID
  roomId?: string // 房屋id
  roomName?: string // 房屋名称
  discountId?: string // 折扣id
  discountType?: string
  applyType?: string // 申请类型
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  createUserName?: string // 创建人
  createUserTel?: string // 创建手机号
  checkUserId?: string // 验房人
  reviewUserId?: string // 通过人
  stateCd?: string // 审核状态: 1申请验房2验房通过3验房不通过 4审批通过5审批不通过
  createRemark?: string // 申请信息
  checkRemark?: string // 验房备注信息
  reviewRemark?: string // 通过备注信息
  statusCd?: string // 数据状态0正常1失效
  inUse?: string // 是否可用 0表示可用；1表示不可用
  feeId?: string //
  returnWay?: string // 返还方式1001折扣1002账户余额
  returnAmount?: string // 返还金额
  img?: string // 图片
  applyRoomDiscountType?: ApplyRoomDiscountTypeReply
  feeDiscount?: FeeDiscountReply
}

export interface ApplyRoomDiscountParams {
  id?: string
  communityId?: string // 小区ID
  roomId?: string // 房屋id
  roomName?: string // 房屋名称
  discountId?: string // 折扣id
  discountType?: string
  applyType?: string // 申请类型
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  createUserName?: string // 创建人
  createUserTel?: string // 创建手机号
  checkUserId?: string // 验房人
  reviewUserId?: string // 通过人
  stateCd?: string // 审核状态: 1申请验房2验房通过3验房不通过 4审批通过5审批不通过
  createRemark?: string // 申请信息
  checkRemark?: string // 验房备注信息
  reviewRemark?: string // 通过备注信息
  statusCd?: string // 数据状态0正常1失效
  inUse?: string // 是否可用 0表示可用；1表示不可用
  feeId?: string //
  returnWay?: string // 返还方式1001折扣1002账户余额
  returnAmount?: string // 返还金额
  img?: string // 图片
}

export interface FindApplyRoomDiscountReply {
  page: Page
  list: Array<ApplyRoomDiscountReply>
  exportUrl: string
}
