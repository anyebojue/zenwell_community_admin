import { request } from 'utils/request/axios'
import {
  FindAllocationStorehouseApplyReply,
  AllocationStorehouseApplyParams
} from '../../model/property/purchase/allocationStorehouseApplyModel'

const ApiPrefix = {
  FindAllocationStorehouseApply: '/property/allocation_storehouse_apply',
  CreateAllocationStorehouseApply: '/property/allocation_storehouse_apply',
  UpdateAllocationStorehouseApply: '/property/allocation_storehouse_apply',
  DeleteAllocationStorehouseApply: '/property/allocation_storehouse_apply'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindAllocationStorehouseApply = (
  params: AllocationStorehouseApplyParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindAllocationStorehouseApplyReply>({
      url: ApiPrefix.FindAllocationStorehouseApply,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateAllocationStorehouseApply = (data: AllocationStorehouseApplyParams) => {
  return request
    .post({
      url: ApiPrefix.CreateAllocationStorehouseApply,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateAllocationStorehouseApply = (data: AllocationStorehouseApplyParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateAllocationStorehouseApply}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteAllocationStorehouseApply = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteAllocationStorehouseApply}/${ids.join(',')}`
    })
    .then(res => res.data)
}
