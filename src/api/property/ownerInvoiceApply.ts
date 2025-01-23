import { request } from 'utils/request/axios'
import {
  FindOwnerInvoiceApplyReply,
  OwnerInvoiceApplyParams
} from '../model/property/ownerInvoiceApplyModel'

const ApiPrefix = {
  FindOwnerInvoiceApply: '/auth/owner_invoice_apply',
  CreateOwnerInvoiceApply: '/auth/owner_invoice_apply',
  UpdateOwnerInvoiceApply: '/auth/owner_invoice_apply',
  DeleteOwnerInvoiceApply: '/auth/owner_invoice_apply'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindOwnerInvoiceApply = (params: OwnerInvoiceApplyParams & PaginationParams) => {
  return request
    .get<FindOwnerInvoiceApplyReply>({
      url: ApiPrefix.FindOwnerInvoiceApply,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateOwnerInvoiceApply = (data: OwnerInvoiceApplyParams) => {
  return request
    .post({
      url: ApiPrefix.CreateOwnerInvoiceApply,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateOwnerInvoiceApply = (data: OwnerInvoiceApplyParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateOwnerInvoiceApply}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteOwnerInvoiceApply = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteOwnerInvoiceApply}/${ids.join(',')}`
    })
    .then(res => res.data)
}
