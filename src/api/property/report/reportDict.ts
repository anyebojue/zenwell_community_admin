import { request } from 'utils/request/axios'
import { FindDictReply, DictParams } from '../../model/dictModel'

const ApiPrefix = {
  FindDict: '/report/dict',
  CreateDict: '/report/dict',
  UpdateDict: '/report/dict',
  DeleteDict: '/report/dict'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindDict = (params: DictParams & PaginationParams) => {
  return request
    .get<FindDictReply>({
      url: ApiPrefix.FindDict,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateDict = (data: DictParams) => {
  return request
    .post({
      url: ApiPrefix.CreateDict,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateDict = (data: DictParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateDict}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteDict = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteDict}/${ids.join(',')}`
    })
    .then(res => res.data)
}
