import { request } from 'utils/request/axios'
import {
  FindOwnerInvoiceApplyItemReply,
  OwnerInvoiceApplyItemParams
} from '../../model/property/houses/ownerInvoiceApplyItemModel'

const ApiPrefix = {
  FindOwnerInvoiceApplyItem: '/auth/owner_invoice_apply_item',
  CreateOwnerInvoiceApplyItem: '/auth/owner_invoice_apply_item',
  UpdateOwnerInvoiceApplyItem: '/auth/owner_invoice_apply_item',
  DeleteOwnerInvoiceApplyItem: '/auth/owner_invoice_apply_item'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindOwnerInvoiceApplyItem = (
  params: OwnerInvoiceApplyItemParams & PaginationParams
) => {
  return request
    .get<FindOwnerInvoiceApplyItemReply>({
      url: ApiPrefix.FindOwnerInvoiceApplyItem,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateOwnerInvoiceApplyItem = (data: OwnerInvoiceApplyItemParams) => {
  return request
    .post({
      url: ApiPrefix.CreateOwnerInvoiceApplyItem,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateOwnerInvoiceApplyItem = (data: OwnerInvoiceApplyItemParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateOwnerInvoiceApplyItem}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteOwnerInvoiceApplyItem = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteOwnerInvoiceApplyItem}/${ids.join(',')}`
    })
    .then(res => res.data)
}
