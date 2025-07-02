import { Page } from '../../pageModel'
import { SpectionRouteReply } from './spectionRouteModel'

export interface SpectionRoutePointReply {
  communityId?: string
  createdAt?: string
  id?: string
  inspectionPointId?: string
  inspectionRouteId?: string
  pointEndTime?: string
  pointStartTime?: string
  remark?: string
  sortNumber?: number
  spectionPoint: SpectionPointReply
  spectionRoute: SpectionRouteReply
  status?: number
  updatedAt: string
}

export interface SpectionRoutePointParams {
  sortNumber?: string
  pointStartTime?: string
  pointEndTime?: string
  inspectionRouteId?: string
  inspectionPointId?: string
  communityId?: string
  status?: number
}

export interface SpectionPointReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  inspectionName?: string // 巡检点名称
  communityId?: string // 小区ID
  remark?: string // 备注说明
  status?: number // 数据状态，0 在用, 1 失效
  pointObjType?: number // 巡检对象类型，1001 设备巡检, 2002 环境巡检
  pointObjId?: string // 对象ID，环境时写-1，设备时写设备ID
  pointObjName?: string // 对象名称
  itemId?: string // 巡检项目ID
  nfcCode?: string // NFC编码
  longitude?: string // 经度
  latitude?: string // 纬度
  sortNumber?: number
  startTime?: string
  endTime?: string
  inspectionRouteId?: string
  inspectionPointId?: string
  pointStartTime?: string
  pointEndTime?: string
}

export interface SpectionPointParams {
  id?: string
  inspectionName?: string // 巡检点名称
  communityId?: string // 小区ID
  remark?: string // 备注说明
  status?: number // 数据状态，0 在用, 1 失效
  pointObjType?: number // 巡检对象类型，1001 设备巡检, 2002 环境巡检
  pointObjId?: string // 对象ID，环境时写-1，设备时写设备ID
  pointObjName?: string // 对象名称
  itemId?: string // 巡检项目ID
  nfcCode?: string // NFC编码
  longitude?: string // 经度
  latitude?: string // 纬度
  sortNumber?: number
  startTime?: string
  endTime?: string
  inspectionRouteId?: string
  inspectionPointId?: string
  pointStartTime?: string
  pointEndTime?: string
  inspectionPlanId?: string
}

export interface FindSpectionRoutePointReply {
  page: Page
  list: Array<SpectionRoutePointReply>
}

export interface FindSpectionPointReply {
  page: Page
  list: Array<SpectionPointReply>
}
