import { request } from 'utils/request/axios'
import { UserInfoReply } from './model/infoModel'

const ApiPrefix = {
  UserLogin: '/auth/info',
  UploadImage: '/file/uploads'
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
    .post({
      url: ApiPrefix.UploadImage,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => res.data.url)
}
