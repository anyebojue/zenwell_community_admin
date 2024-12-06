import { Page } from './pageModel'

export interface CommunityReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  bId?: string // 业务ID
  name?: string // 小区名称
  address?: string // 小区地址
  nearbyLandmarks?: string // 地标，如王府井北60米
  cityCode?: string // 根据定位获取城市编码
  mapX?: string // 地区 x坐标
  mapY?: string // 地区 y坐标
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  state?: string // 审核状态
  communityArea?: number // 小区面积
  tel?: string // 联系方式
  payFeeMonth?: string // 缴费周期
  feePrice?: number // 每月单价
  qrCode?: string // 客服二维码
  outId?: string // 外部导入ID
}

export interface CommunityParams {
  id?: string
  name?: string
  img?: string
  status?: number | null
  intro?: string
  is_top?: number
  start_time?: string
  end_time?: string
}

export interface FindCommunityReply {
  page: Page
  list: Array<CommunityReply>
}
