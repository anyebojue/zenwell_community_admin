import { request } from 'utils/request/axios'
import { FindVenueReply, VenueParams } from '../../model/property/houses/venueModel'

const ApiPrefix = {
  FindVenue: '/auth/venue',
  CreateVenue: '/auth/venue',
  UpdateVenue: '/auth/venue',
  DeleteVenue: '/auth/venue'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindVenue = (params: VenueParams & PaginationParams) => {
  return request
    .get<FindVenueReply>({
      url: ApiPrefix.FindVenue,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateVenue = (data: VenueParams) => {
  return request
    .post({
      url: ApiPrefix.CreateVenue,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateVenue = (data: VenueParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateVenue}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteVenue = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteVenue}/${ids.join(',')}`
    })
    .then(res => res.data)
}
