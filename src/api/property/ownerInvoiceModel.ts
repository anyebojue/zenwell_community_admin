import { request } from 'utils/request/axios'
import { FindOwnerInvoiceReply, OwnerInvoiceParams } from '../model/property/ownerInvoiceModel'

const ApiPrefix = {
  FindOwnerInvoice: '/auth/owner_invoice',
  CreateOwnerInvoice: '/auth/owner_invoice',
  UpdateOwnerInvoice: '/auth/owner_invoice',
  DeleteOwnerInvoice: '/auth/owner_invoice'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindOwnerInvoice = (params: OwnerInvoiceParams & PaginationParams) => {
  return request
    .get<FindOwnerInvoiceReply>({
      url: ApiPrefix.FindOwnerInvoice,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateOwnerInvoice = (data: OwnerInvoiceParams) => {
  return request
    .post({
      url: ApiPrefix.CreateOwnerInvoice,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateOwnerInvoice = (data: OwnerInvoiceParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateOwnerInvoice}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteOwnerInvoice = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteOwnerInvoice}/${ids.join(',')}`
    })
    .then(res => res.data)
}
