import { request } from 'utils/request/axios'
import { FindImportFeeReply, ImportFeeParams } from '../../model/property/feeConfig/importFeeModel'

const ApiPrefix = {
  FindImportFee: '/fee/import_fee',
  CreateImportFee: '/fee/import_fee',
  UpdateImportFee: '/fee/import_fee',
  DeleteImportFee: '/fee/import_fee',
  ImportFee: '/fee/import/import_fee'
}

/**
 * 费用导入
 * @param data
 * @returns
 */
export const ImportFee = (data: FormData) => {
  return request
    .post({
      url: ApiPrefix.ImportFee,
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindImportFee = (params: ImportFeeParams & PaginationParams) => {
  return request
    .get<FindImportFeeReply>({
      url: ApiPrefix.FindImportFee,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateImportFee = (data: ImportFeeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateImportFee,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateImportFee = (data: ImportFeeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateImportFee}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteImportFee = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteImportFee}/${ids.join(',')}`
    })
    .then(res => res.data)
}
