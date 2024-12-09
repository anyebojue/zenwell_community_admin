import { Page } from './pageModel'

export interface CommunityReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  bId?: string // 社区编码
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
  name: string //小区名称
  city_code: string //小区地区
  address: string //小区地址
  nearby_landmarks: string //附近地标
  tel: string //客服电话
  pay_fee_month: string //缴费周期
  fee_price: number //每月单价
  b_id: string //社区编码
}

export interface FindCommunityReply {
  page: Page
  list: Array<CommunityReply>
}
