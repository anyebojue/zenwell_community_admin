import { Page } from '../pageModel'

export interface RoomReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string // 小区ID
  roomNum?: string // 房屋编号
  unitId?: string // 单元ID
  layer?: string // 层数
  section?: number // 室
  apartment?: string // 户型
  builtUpArea?: number // 建筑面积
  roomArea?: number // 室内面积
  feeCoefficient?: number // 算费系数
  roomType?: string // 房屋类型
  roomSubType?: string // 房屋子类型 110 住宅房屋，119 办公室，120 宿舍
  roomRent?: number // 租金
  userId?: string // 用户ID
  state?: string // 房屋状态，如房屋出售等，请查看state 表
  outNo?: string // 外部导入ID
  remark?: string // 备注
  status?: number // 数据状态，0 在用，1 失效
}

export interface RoomParams {
  id?: string
  communityId?: string // 小区ID
  roomNum?: string // 房屋编号
  unitId?: string // 单元ID
  layer?: string // 层数
  section?: number // 室
  apartment?: string // 户型
  builtUpArea?: number // 建筑面积
  roomArea?: number // 室内面积
  feeCoefficient?: number // 算费系数
  roomType?: string // 房屋类型
  roomSubType?: string // 房屋子类型 110 住宅房屋，119 办公室，120 宿舍
  roomRent?: number // 租金
  userId?: string // 用户ID
  state?: string // 房屋状态，如房屋出售等，请查看state 表
  outNo?: string // 外部导入ID
  remark?: string // 备注
  status?: number // 数据状态，0 在用，1 失效
}

export interface FindRoomReply {
  page: Page
  list: Array<RoomReply>
}
