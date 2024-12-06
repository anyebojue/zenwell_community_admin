export interface UserInfoReply {
  id: string
  username: string
  code: string
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
