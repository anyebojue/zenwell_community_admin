import { request } from 'utils/request/axios'
import {
  FindMeterWaterReply,
  MeterWaterParams
} from '../../model/property/feeConfig/meterWaterModel'

const ApiPrefix = {
  FindMeterWater: '/fee/meter_water',
  CreateMeterWater: '/fee/meter_water',
  UpdateMeterWater: '/fee/meter_water',
  DeleteMeterWater: '/fee/meter_water'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindMeterWater = (params: MeterWaterParams & PaginationParams) => {
  return request
    .get<FindMeterWaterReply>({
      url: ApiPrefix.FindMeterWater,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateMeterWater = (data: MeterWaterParams) => {
  return request
    .post({
      url: ApiPrefix.CreateMeterWater,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateMeterWater = (data: MeterWaterParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateMeterWater}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteMeterWater = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteMeterWater}/${ids.join(',')}`
    })
    .then(res => res.data)
}
