import { request } from 'utils/request/axios'
import {
  FindOwnerInvoiceApplyEventReply,
  OwnerInvoiceApplyEventParams
} from '../../model/property/houses/ownerInvoiceApplyEventModel'

const ApiPrefix = {
  FindOwnerInvoiceApplyEvent: '/auth/owner_invoice_apply_event',
  CreateOwnerInvoiceApplyEvent: '/auth/owner_invoice_apply_event',
  UpdateOwnerInvoiceApplyEvent: '/auth/owner_invoice_apply_event',
  DeleteOwnerInvoiceApplyEvent: '/auth/owner_invoice_apply_event'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindOwnerInvoiceApplyEvent = (
  params: OwnerInvoiceApplyEventParams & PaginationParams
) => {
  return request
    .get<FindOwnerInvoiceApplyEventReply>({
      url: ApiPrefix.FindOwnerInvoiceApplyEvent,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateOwnerInvoiceApplyEvent = (data: OwnerInvoiceApplyEventParams) => {
  return request
    .post({
      url: ApiPrefix.CreateOwnerInvoiceApplyEvent,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateOwnerInvoiceApplyEvent = (data: OwnerInvoiceApplyEventParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateOwnerInvoiceApplyEvent}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteOwnerInvoiceApplyEvent = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteOwnerInvoiceApplyEvent}/${ids.join(',')}`
    })
    .then(res => res.data)
}
