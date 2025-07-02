import { request } from 'utils/request/axios'
import {
  FindReportCustomGroupReply,
  ReportCustomGroupParams
} from '../../model/platform/reportConfiguration/reportCustomGroupModel'

const ApiPrefix = {
  FindReportCustomGroup: '/report/report_custom_group',
  CreateReportCustomGroup: '/report/report_custom_group',
  UpdateReportCustomGroup: '/report/report_custom_group',
  DeleteReportCustomGroup: '/report/report_custom_group'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindReportCustomGroup = (params: ReportCustomGroupParams & PaginationParams) => {
  return request
    .get<FindReportCustomGroupReply>({
      url: ApiPrefix.FindReportCustomGroup,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateReportCustomGroup = (data: ReportCustomGroupParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReportCustomGroup,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateReportCustomGroup = (data: ReportCustomGroupParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReportCustomGroup}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReportCustomGroup = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReportCustomGroup}/${ids.join(',')}`
    })
    .then(res => res.data)
}
