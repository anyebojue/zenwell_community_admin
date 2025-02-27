import { request } from 'utils/request/axios'
import {
  FindReportOweFeeReply,
  ReportOweFeeParams
} from '../../model/property/feeConfig/reportOweFeeModel'

const ApiPrefix = {
  FindReportOweFee: '/fee/report_owe_fee',
  CreateReportOweFee: '/fee/report_owe_fee',
  UpdateReportOweFee: '/fee/report_owe_fee',
  DeleteReportOweFee: '/fee/report_owe_fee'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindReportOweFee = (params: ReportOweFeeParams & PaginationParams) => {
  return request
    .get<FindReportOweFeeReply>({
      url: ApiPrefix.FindReportOweFee,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateReportOweFee = (data: ReportOweFeeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReportOweFee,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateReportOweFee = (data: ReportOweFeeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReportOweFee}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReportOweFee = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReportOweFee}/${ids.join(',')}`
    })
    .then(res => res.data)
}
