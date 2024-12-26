import { Page } from './pageModel'

export interface CityAreaReply {
  id: string
  createdAt: string
  updatedAt: string
  status: number
  remark: string
  areaCode: string
  areaName: string
  areaLevel: string
  parentAreaCode: string
  parentAreaName: string
  lon: string
  lat: string
}

export interface FindCityAreaReply {
  page: Page
  list: Array<CityAreaReply>
}
