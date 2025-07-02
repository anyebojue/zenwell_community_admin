import { request } from 'utils/request/axios'
import {
  FindCarBlackWhiteReply,
  CarBlackWhiteParams
} from '../../model/property/parking/carBlackWhiteModel'

const ApiPrefix = {
  FindCarBlackWhite: '/car/car_black_white',
  CreateCarBlackWhite: '/car/car_black_white',
  UpdateCarBlackWhite: '/car/car_black_white',
  DeleteCarBlackWhite: '/car/car_black_white'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindCarBlackWhite = (
  params: CarBlackWhiteParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindCarBlackWhiteReply>({
      url: ApiPrefix.FindCarBlackWhite,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateCarBlackWhite = (data: CarBlackWhiteParams) => {
  return request
    .post({
      url: ApiPrefix.CreateCarBlackWhite,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateCarBlackWhite = (data: CarBlackWhiteParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateCarBlackWhite}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteCarBlackWhite = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteCarBlackWhite}/${ids.join(',')}`
    })
    .then(res => res.data)
}
