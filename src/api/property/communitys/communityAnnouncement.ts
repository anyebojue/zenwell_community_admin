import { request } from 'utils/request/axios'
import {
  FindCommunityAnnouncementReply,
  CommunityAnnouncementParams
} from '../../model/property/communitys/communityAnnouncementModel'

const ApiPrefix = {
  FindCommunityAnnouncement: '/announcement',
  CreateCommunityAnnouncement: '/announcement',
  UpdateCommunityAnnouncement: '/announcement',
  DeleteCommunityAnnouncement: '/announcement'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindCommunityAnnouncement = (
  params: CommunityAnnouncementParams & PaginationParams
) => {
  return request
    .get<FindCommunityAnnouncementReply>({
      url: ApiPrefix.FindCommunityAnnouncement,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateCommunityAnnouncement = (data: CommunityAnnouncementParams) => {
  return request
    .post({
      url: ApiPrefix.CreateCommunityAnnouncement,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateCommunityAnnouncement = (data: CommunityAnnouncementParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateCommunityAnnouncement}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteCommunityAnnouncement = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteCommunityAnnouncement}/${ids.join(',')}`
    })
    .then(res => res.data)
}
