export interface LoginToParams {
  username: string
  password: string
  to: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface UserLoginReply {
  token: string
  expires: string
}
