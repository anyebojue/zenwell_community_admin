export interface LoginParams {
  username: string
  password: string
}

export interface UserLoginReply {
  token: string
  expires: string
}
