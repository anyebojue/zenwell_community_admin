import { Page } from '../../pageModel'

export interface CommunityAnnouncementReply {
  id: string
  createdAt: string
  updatedAt: string
  communityId: string
  title: string // 公示标题
  type: number // 公示类型
  content: string // 活动内容
  photo: string // 头部照片
}

export interface CommunityAnnouncementParams {
  id?: string
  title?: string // 公示标题
  type?: number // 公示类型
  content?: string // 活动内容
  photo?: string // 头部照片
  communityId?: string
}

export interface FindCommunityAnnouncementReply {
  page: Page
  list: Array<CommunityAnnouncementReply>
}
