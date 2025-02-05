import { Page } from '../pageModel'

export interface ReleaseReply {
  id?: string
  typeId?: string // 类型ID
  applyCompany?: string // 申请单位
  applyPerson?: string // 申请人
  idCard?: string // 身份证
  applyTel?: string // 手机号
  passTime?: string // 通行时间
  statusCd?: string // 状态 0 W 待审核 1 D 审核中 2 C 审核完成 3 D 审核失败
  carNum?: string // 车牌号
  remark?: string // 备注
  communityId?: string // 小区ID
  createUserId?: string // 创建用户ID
  status?: number // 数据状态，0 在用 1 失效
  releaseRes?: string
}

export interface ReleaseParams {
  id?: string
  typeId?: string // 类型ID
  applyCompany?: string // 申请单位
  applyPerson?: string // 申请人
  idCard?: string // 身份证
  applyTel?: string // 手机号
  passTime?: string // 通行时间
  statusCd?: number // 状态 0 W 待审核 1 D 审核中 2 C 审核完成 3 D 审核失败
  carNum?: string // 车牌号
  remark?: string // 备注
  communityId?: string // 小区ID
  createUserId?: string // 创建用户ID
  status?: number // 数据状态，0 在用 1 失效
}

export interface FindReleaseReply {
  page: Page
  list: Array<ReleaseReply>
}
