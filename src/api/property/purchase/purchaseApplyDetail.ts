import { request } from 'utils/request/axios'
import {
  FindPurchaseApplyDetailReply,
  PurchaseApplyDetailParams
} from '../../model/property/purchase/purchaseApplyDetailModel'

const ApiPrefix = {
  FindPurchaseApplyDetail: '/property/purchase_apply_detail',
  CreatePurchaseApplyDetail: '/property/purchase_apply_detail',
  UpdatePurchaseApplyDetail: '/property/purchase_apply_detail',
  DeletePurchaseApplyDetail: '/property/purchase_apply_detail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindPurchaseApplyDetail = (
  params: PurchaseApplyDetailParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindPurchaseApplyDetailReply>({
      url: ApiPrefix.FindPurchaseApplyDetail,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreatePurchaseApplyDetail = (data: PurchaseApplyDetailParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePurchaseApplyDetail,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdatePurchaseApplyDetail = (data: PurchaseApplyDetailParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdatePurchaseApplyDetail}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeletePurchaseApplyDetail = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePurchaseApplyDetail}/${ids.join(',')}`
    })
    .then(res => res.data)
}
