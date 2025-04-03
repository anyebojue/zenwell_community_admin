import { request } from 'utils/request/axios'
import { FindMachineReply, MachineParams } from '../../model/property/parking/machineModel'

const ApiPrefix = {
  FindMachine: '/car/machine',
  CreateMachine: '/car/machine',
  UpdateMachine: '/car/machine',
  DeleteMachine: '/car/machine'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindMachine = (params: MachineParams & PaginationParams & { is_export?: boolean }) => {
  return request
    .get<FindMachineReply>({
      url: ApiPrefix.FindMachine,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateMachine = (data: MachineParams) => {
  return request
    .post({
      url: ApiPrefix.CreateMachine,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateMachine = (data: MachineParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateMachine}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteMachine = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteMachine}/${ids.join(',')}`
    })
    .then(res => res.data)
}
