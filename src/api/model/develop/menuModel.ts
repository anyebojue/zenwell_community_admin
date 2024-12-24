import { Page } from '../pageModel'

export interface MenuReply {
  btn?: string
  code?: string
  icon?: string
  id?: string
  isShow?: number
  menu?: string
  name?: string
  pId?: string
  plate?: string
  resource?: string
  sort?: string
  word?: string
  children?: MenuReply[]
}

export interface MenuParams {
  btn?: string
  code?: string
  icon?: string
  id?: string
  isShow?: number
  menu?: string
  name?: string
  pId?: string
  plate?: string
  resource?: string
  sort?: string
  word?: string
}

export interface FindMenuReply {
  page: Page
  list: Array<MenuReply>
}
