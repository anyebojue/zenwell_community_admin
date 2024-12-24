import { request } from 'utils/request/axios'
import { UserInfoReply } from './model/infoModel'

const ApiPrefix = {
  ChangePassword: '/auth/pwd',
  UserLogin: '/auth/info',
  UploadImage: '/file/uploads'
}

interface UploadImageResponse {
  url: string
}

/**
 * 修改密码
 * @returns
 */
export const ChangePassword = (data: {
  username: string
  oldPassword: string
  newPassword: string
}) => {
  return request
    .post({
      url: ApiPrefix.ChangePassword,
      data
    })
    .then(res => res.data)
}

/**
 * 获取用户信息
 * @returns
 */
export const userInfo = () => {
  return request
    .get<UserInfoReply>({
      url: ApiPrefix.UserLogin
    })
    .then(res => res.data)
}

/**
 * 上传图片接口
 * @param {File} img - 要上传的图片文件
 * @returns {Promise<string>} 图片上传后的URL
 */
export const uploadImage = (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  return request
    .post<UploadImageResponse>({
      url: ApiPrefix.UploadImage,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => res.data.url)
}
