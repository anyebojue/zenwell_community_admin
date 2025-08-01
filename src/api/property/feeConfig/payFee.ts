import { request } from 'utils/request/axios'
import { PayFeeBatchParams } from 'api/model/property/feeConfig/payFeeBatchModel'
import { FindPayFeeReply, PayFeeParams } from '../../model/property/feeConfig/payFeeModel'

const ApiPrefix = {
  FindPayFee: '/fee/pay_fee',
  CreatePayFee: '/fee/pay_fee',
  UpdatePayFee: '/fee/pay_fee',
  DeletePayFee: '/fee/pay_fee',
  GetImportTemplate: '/fee/pay_fee_custom_template',
  ImportCustomFee: '/fee/import/import_custom_fee',
  PayFeesBatch: '/fee/pay_fees_batch'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindPayFee = (params: PayFeeParams & PaginationParams) => {
  return request
    .get<FindPayFeeReply>({
      url: ApiPrefix.FindPayFee,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreatePayFee = (data: PayFeeParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePayFee,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdatePayFee = (data: PayFeeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdatePayFee}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeletePayFee = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePayFee}/${ids.join(',')}`
    })
    .then(res => res.data)
}

/**
 * 自定义模板
 * @param params
 * @returns
 */
export const GetImportTemplate = (params: {
  configIds: string
  floorIds: string
  type: string
}) => {
  return request
    .get<FindPayFeeReply>({
      url: ApiPrefix.GetImportTemplate,
      params
    })
    .then(res => res.data)
}

/**
 * 自定义导入
 * @param data
 * @returns
 */
export const ImportCustomFee = (data: FormData) => {
  return request
    .post({
      url: ApiPrefix.ImportCustomFee,
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => res.data)
}

/**
 * 批量创建
 * @param data
 * @returns
 */
export const PayFeesBatch = (data: PayFeeBatchParams) => {
  return request
    .post({
      url: ApiPrefix.PayFeesBatch,
      data
    })
    .then(res => res.data)
}
