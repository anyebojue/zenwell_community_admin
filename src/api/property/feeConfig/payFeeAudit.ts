import { request } from 'utils/request/axios'
import {
  FindPayFeeAuditReply,
  PayFeeAuditParams
} from '../../model/property/feeConfig/payFeeAuditModel'

const ApiPrefix = {
  FindPayFeeAudit: '/fee/pay_fee_audit',
  CreatePayFeeAudit: '/fee/pay_fee_audit',
  UpdatePayFeeAudit: '/fee/pay_fee_audit',
  DeletePayFeeAudit: '/fee/pay_fee_audit'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindPayFeeAudit = (params: PayFeeAuditParams & PaginationParams) => {
  return request
    .get<FindPayFeeAuditReply>({
      url: ApiPrefix.FindPayFeeAudit,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreatePayFeeAudit = (data: PayFeeAuditParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePayFeeAudit,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdatePayFeeAudit = (data: PayFeeAuditParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdatePayFeeAudit}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeletePayFeeAudit = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePayFeeAudit}/${ids.join(',')}`
    })
    .then(res => res.data)
}
