import { request } from 'utils/request/axios'
import { FindMenuReply, MenuParams } from '../model/develop/menuModel'

const ApiPrefix = {
  FindMenu: '/auth/action',
  CreateMenu: '/auth/action',
  UpdateMenu: '/auth/action',
  DeleteMenu: '/auth/action'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindMenu = (params: MenuParams & PaginationParams) => {
  return request
    .get<FindMenuReply>({
      url: ApiPrefix.FindMenu,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateMenu = (data: MenuParams) => {
  return request
    .post({
      url: ApiPrefix.CreateMenu,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateMenu = (data: MenuParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateMenu}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteMenu = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteMenu}/${ids.join(',')}`
    })
    .then(res => res.data)
}
