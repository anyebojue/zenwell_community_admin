export interface UserInfoReply {
  id: string
  username: string
  code: string
  platform: string // 0物业 1平台 2开发
  permission: {
    resources: Array<string>
    menus: Array<string>
    btns: Array<string>
  }
  company: {
    id: string
    name: string
    content: string
    createdAt: string
    updatedAt: string
  }
}
