import { request } from 'utils/request/axios'
import {
  FindRepairPoolReply,
  RepairPoolParams,
  RepairPoolReply,
  RepairReturnVisitParams
} from '../model/property/repairPoolModel'

const ApiPrefix = {
  CreateRepairReturnVisit: '/auth/repair_return_visit',
  GetRepairPool: '/auth/repair_pool',
  FindRepairPool: '/auth/repair_pool',
  CreateRepairPool: '/auth/repair_pool',
  UpdateRepairPool: '/auth/repair_pool',
  DeleteRepairPool: '/auth/repair_pool'
}

type WritableDraft<T> = { -readonly [K in keyof T]: T[K] }

/**
 * 报修回访
 * @param data
 * @returns
 */
export const CreateRepairReturnVisit = (data: RepairReturnVisitParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRepairReturnVisit,
      data
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const GetRepairPool = (params: { id: string }) => {
  return request
    .get<WritableDraft<RepairPoolReply>>({
      url: `${ApiPrefix.GetRepairPool}/${params.id}`
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRepairPool = (params: RepairPoolParams & PaginationParams) => {
  return request
    .get<FindRepairPoolReply>({
      url: ApiPrefix.FindRepairPool,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateRepairPool = (data: RepairPoolParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRepairPool,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateRepairPool = (data: RepairPoolParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRepairPool}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRepairPool = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRepairPool}/${ids.join(',')}`
    })
    .then(res => res.data)
}
