import { request } from 'utils/request/axios'
import { LoginParams, UserLoginReply } from './model/loginModel'

const ApiPrefix = {
  UserLogin: '/api/auth/login'
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
