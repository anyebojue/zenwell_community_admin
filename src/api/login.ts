import { request } from 'utils/request/axios'
import { LoginParams, LoginToParams, UserLoginReply } from './model/loginModel'

const ApiPrefix = {
  LoginTo: '/auth/login_to',
  UserLogin: '/api/auth/login'
}

/**
 * 物业一键登录
 * @param data username password
 * @returns
 */
export const LoginTo = (data: LoginToParams) => {
  return request
    .post<UserLoginReply>({
      url: ApiPrefix.LoginTo,
      data
    })
    .then(res => res.data)
}

/**
 * 用户登录
 * @param params
 * @returns
 */
export const Login = (data: LoginParams) => {
  return request
    .post<UserLoginReply>({
      url: ApiPrefix.UserLogin,
      data
    })
    .then(res => res.data)
}
