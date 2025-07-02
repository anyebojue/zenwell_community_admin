import { request } from 'utils/request/axios'
import {
  FindReportFeeYearCollectionReply,
  ReportFeeYearCollectionParams
} from '../../model/property/report/reportFeeYearCollectionModel'

const ApiPrefix = {
  FindReportFeeYearCollection: '/report/report_fee_year_collection',
  CreateReportFeeYearCollection: '/report/report_fee_year_collection',
  UpdateReportFeeYearCollection: '/report/report_fee_year_collection',
  DeleteReportFeeYearCollection: '/report/report_fee_year_collection'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindReportFeeYearCollection = (
  params: ReportFeeYearCollectionParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindReportFeeYearCollectionReply>({
      url: ApiPrefix.FindReportFeeYearCollection,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateReportFeeYearCollection = (data: ReportFeeYearCollectionParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReportFeeYearCollection,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateReportFeeYearCollection = (data: ReportFeeYearCollectionParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReportFeeYearCollection}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReportFeeYearCollection = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReportFeeYearCollection}/${ids.join(',')}`
    })
    .then(res => res.data)
}
