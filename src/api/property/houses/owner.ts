import { request } from 'utils/request/axios'
import { FindOwnerReply, OwnerParams, OwnerReply } from '../../model/property/houses/ownerModel'

const ApiPrefix = {
  GetOwner: '/auth/owner',
  FindOwner: '/auth/owner',
  CreateOwner: '/auth/owner',
  UpdateOwner: '/auth/owner',
  DeleteOwner: '/auth/owner'
}

type WritableDraft<T> = { -readonly [K in keyof T]: T[K] }

/**
 * 查询接口
 * @param params
 * @returns
 */
export const GetOwner = (params: { id: string }) => {
  return request
    .get<WritableDraft<OwnerReply>>({
      url: `${ApiPrefix.GetOwner}/${params.id}`
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindOwner = (params: OwnerParams & PaginationParams) => {
  return request
    .get<FindOwnerReply>({
      url: ApiPrefix.FindOwner,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateOwner = (data: OwnerParams) => {
  return request
    .post({
      url: ApiPrefix.CreateOwner,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateOwner = (data: OwnerParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateOwner}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteOwner = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteOwner}/${ids.join(',')}`
    })
    .then(res => res.data)
}
