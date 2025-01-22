import { request } from 'utils/request/axios'
import { FindSpacePersonReply, SpacePersonParams } from '../model/property/spacePersonModel'

const ApiPrefix = {
  FindSpacePerson: '/auth/space_person',
  CreateSpacePerson: '/auth/space_person',
  UpdateSpacePerson: '/auth/space_person',
  DeleteSpacePerson: '/auth/space_person'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpacePerson = (params: SpacePersonParams & PaginationParams) => {
  return request
    .get<FindSpacePersonReply>({
      url: ApiPrefix.FindSpacePerson,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpacePerson = (data: SpacePersonParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpacePerson,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpacePerson = (data: SpacePersonParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpacePerson}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpacePerson = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpacePerson}/${ids.join(',')}`
    })
    .then(res => res.data)
}
