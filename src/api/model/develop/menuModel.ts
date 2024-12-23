import { Page } from '../pageModel'

export interface MenuReply {
  id?: string
  code?: string
  name?: string
  word?: string
  resource?: string
  menu?: string
  btn?: string
  pId?: string
  plate?: string
  children?: MenuReply[]
}

export interface MenuParams {
  id?: string
  code?: string
  name?: string
  word?: string
  resource?: string
  menu?: string
  btn?: string
  pId?: string
  plate?: string
}

export interface FindMenuReply {
  page: Page
  list: Array<MenuReply>
}
