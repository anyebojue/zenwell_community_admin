import { Page } from '../pageModel'
import { CommunityReply } from './communityModel'
import { EmployeesReply } from './organization/employeesModel'

export interface CompanyReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  storeId?: string
  communityId?: string
  community?: CommunityReply
  store?: PropertyCompanyReply
}

export interface PropertyCompanyReply {
  address: '麒麟座D' // 地址
  createdAt: '2024-12-10 03:11:21' // 创建时间
  id: '9027253631635685377' // 编号
  mapX: '重庆' // 地标
  mapY: '' // 地标
  name: '测试物业' // 名称
  nearbyLandmarks: '2024-12-10' // 成立日期
  state: ''
  statusCd: '0'
  storeTypeCd: 'zenwell' // 公司法人（管理员）
  tel: '13130701269' // 电话
  updatedAt: '2024-12-10 03:11:21' // 更新时间
  user: EmployeesReply
}

export interface PropertyCompanyParams {
  id?: string
  name?: string // 名称
  address?: string // 地址
  tel?: string // 电话
  store_type_cd?: string // 公司法人（管理员）
  nearby_landmarks?: string // 成立日期
  map_x?: string // 地标
}

export interface FindCompanyReply {
  page: Page
  list: Array<CompanyReply>
}

export interface FindPropertyCompanyReply {
  page: Page
  list: Array<PropertyCompanyReply>
}
