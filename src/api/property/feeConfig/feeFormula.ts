import { request } from 'utils/request/axios'
import {
  FindFeeFormulaReply,
  FeeFormulaParams
} from '../../model/property/feeConfig/feeFormulaModel'

const ApiPrefix = {
  FindFeeFormula: '/fee/fee_formula',
  CreateFeeFormula: '/fee/fee_formula',
  UpdateFeeFormula: '/fee/fee_formula',
  DeleteFeeFormula: '/fee/fee_formula'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeFormula = (params: FeeFormulaParams & PaginationParams) => {
  return request
    .get<FindFeeFormulaReply>({
      url: ApiPrefix.FindFeeFormula,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeFormula = (data: FeeFormulaParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeFormula,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeFormula = (data: FeeFormulaParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeFormula}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeFormula = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeFormula}/${ids.join(',')}`
    })
    .then(res => res.data)
}
