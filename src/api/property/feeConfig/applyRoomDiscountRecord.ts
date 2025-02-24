import { request } from 'utils/request/axios'
import {
  FindApplyRoomDiscountRecordReply,
  ApplyRoomDiscountRecordParams
} from '../../model/property/feeConfig/applyRoomDiscountRecordModel'

const ApiPrefix = {
  FindApplyRoomDiscountRecord: '/fee/apply_room_discount_record',
  CreateApplyRoomDiscountRecord: '/fee/apply_room_discount_record',
  UpdateApplyRoomDiscountRecord: '/fee/apply_room_discount_record',
  DeleteApplyRoomDiscountRecord: '/fee/apply_room_discount_record'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindApplyRoomDiscountRecord = (
  params: ApplyRoomDiscountRecordParams & PaginationParams
) => {
  return request
    .get<FindApplyRoomDiscountRecordReply>({
      url: ApiPrefix.FindApplyRoomDiscountRecord,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateApplyRoomDiscountRecord = (data: ApplyRoomDiscountRecordParams) => {
  return request
    .post({
      url: ApiPrefix.CreateApplyRoomDiscountRecord,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateApplyRoomDiscountRecord = (data: ApplyRoomDiscountRecordParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateApplyRoomDiscountRecord}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteApplyRoomDiscountRecord = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteApplyRoomDiscountRecord}/${ids.join(',')}`
    })
    .then(res => res.data)
}
