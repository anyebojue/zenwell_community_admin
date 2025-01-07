import { Page } from '../pageModel'
import { RoomReply } from './roomModel'

export interface OwnerReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string // 业主名称
  sex?: string // 性别
  age?: string // 年龄
  link?: string // 联系人手机号
  userId?: string // 用户ID
  ownerTypeCd?: string // 业主类型 1001 业主本人 1002 家庭成员
  communityId?: string // 小区ID
  idCard?: string // 身份证号码
  state?: number // 业主成员状态 1000 待审核 2000 审核完成 3000 拒绝审核
  ownerFlag?: number // 业主标识 1 真实业主 0 虚拟业主
  address?: string // 家庭住址
  remark?: string // 备注
  status?: number // 状态 1 在用 0 停用
  room?: RoomReply[]
}

export interface OwnerParams {
  id?: string
  name?: string // 业主名称
  sex?: string // 性别
  age?: string // 年龄
  link?: string // 联系人手机号
  userId?: string // 用户ID
  ownerTypeCd?: string // 业主类型 1001 业主本人 1002 家庭成员
  communityId?: string // 小区ID
  idCard?: string // 身份证号码
  state?: number // 业主成员状态 1000 待审核 2000 审核完成 3000 拒绝审核
  ownerFlag?: number // 业主标识 1 真实业主 0 虚拟业主
  address?: string // 家庭住址
  remark?: string // 备注
  status?: number // 状态 1 在用 0 停用
}

export interface FindOwnerReply {
  page: Page
  list: Array<OwnerReply>
}
