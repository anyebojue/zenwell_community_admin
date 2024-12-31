import { Page } from '../pageModel'

export interface SystemSettingsReply {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  key: string
  describe: string
  values: string
  relationId: string
  relationType: number
}

export interface SystemSettingsParams {
  id?: string
  name?: string
  key?: string
  describe?: string
  values?: string
  relationId?: string
  relationType?: number
}

export interface FindSystemSettingsReply {
  page: Page
  list: Array<SystemSettingsReply>
}
