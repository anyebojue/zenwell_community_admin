import { Page } from '../../pageModel'
import { SpaceReply } from './spaceModel.tsx'

export interface SpacePersonReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  spaceId?: string // 场地ID
  personId?: string // 用户ID
  personName?: string // 预约人
  personTel?: string // 预约电话
  appointmentTime?: string // 预约时间
  receivableAmount?: number // 应收金额
  receivedAmount?: number // 实收金额
  payWay?: number // 支付方式，1 现金，2 微信，3 支付宝
  communityId?: string // 小区ID
  stateCd?: string // 状态，1 预约成功，2 预约失败，3 待审核，4 待支付 5 取消预约
  remark?: string // 备注
  orderId?: string // 订单编号 备用
  status?: number // 记录状态，0 禁用，1 启用
  hours?: number // 小时
  checkState?: string // 核销状态 W 待核销 C核销完成
  space?: SpaceReply
}

export interface SpacePersonParams {
  id?: string
  spaceId?: string // 场地ID
  personId?: string // 用户ID
  personName?: string // 预约人
  personTel?: string // 预约电话
  appointmentTime?: string // 预约时间
  receivableAmount?: number // 应收金额
  receivedAmount?: number // 实收金额
  payWay?: number // 支付方式，1 现金，2 微信，3 支付宝
  communityId?: string // 小区ID
  stateCd?: string // 状态，1 预约成功，2 预约失败，3 待审核，4 待支付
  remark?: string // 备注
  orderId?: string // 订单编号 备用
  status?: number // 记录状态，0 禁用，1 启用
  hours?: number // 小时
  checkState?: string // 核销状态 W 待核销 C核销完成
}

export interface FindSpacePersonReply {
  page: Page
  list: Array<SpacePersonReply>
}
