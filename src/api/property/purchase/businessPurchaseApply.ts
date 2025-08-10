import { request } from 'utils/request/axios'
import {
  FindBusinessPurchaseApplyReply,
  BusinessPurchaseApplyParams
} from '../../model/property/purchase/businessPurchaseApplyModel'

const ApiPrefix = {
  FindBusinessPurchaseApply: '/property/business_purchase_apply',
  CreateBusinessPurchaseApply: '/property/business_purchase_apply',
  UpdateBusinessPurchaseApply: '/property/business_purchase_apply',
  DeleteBusinessPurchaseApply: '/property/business_purchase_apply'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindBusinessPurchaseApply = (
  params: BusinessPurchaseApplyParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindBusinessPurchaseApplyReply>({
      url: ApiPrefix.FindBusinessPurchaseApply,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateBusinessPurchaseApply = (data: BusinessPurchaseApplyParams) => {
  return request
    .post({
      url: ApiPrefix.CreateBusinessPurchaseApply,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateBusinessPurchaseApply = (data: BusinessPurchaseApplyParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateBusinessPurchaseApply}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteBusinessPurchaseApply = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteBusinessPurchaseApply}/${ids.join(',')}`
    })
    .then(res => res.data)
}
