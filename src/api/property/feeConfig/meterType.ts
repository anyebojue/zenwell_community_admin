import { request } from 'utils/request/axios'
import { FindMeterTypeReply, MeterTypeParams } from '../../model/property/feeConfig/meterTypeModel'

const ApiPrefix = {
  FindMeterType: '/fee/meter_type',
  CreateMeterType: '/fee/meter_type',
  UpdateMeterType: '/fee/meter_type',
  DeleteMeterType: '/fee/meter_type'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindMeterType = (params: MeterTypeParams & PaginationParams) => {
  return request
    .get<FindMeterTypeReply>({
      url: ApiPrefix.FindMeterType,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateMeterType = (data: MeterTypeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateMeterType,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateMeterType = (data: MeterTypeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateMeterType}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteMeterType = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteMeterType}/${ids.join(',')}`
    })
    .then(res => res.data)
}
