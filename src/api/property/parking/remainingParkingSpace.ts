import { request } from 'utils/request/axios'
import { FindRemainingParkingSpaceReply } from '../../model/property/parking/remainingParkingSpaceModel'

const ApiPrefix = {
  FindRemainingParkingSpace: '/car/remaining_parking_space'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRemainingParkingSpace = () => {
  return request
    .get<FindRemainingParkingSpaceReply>({
      url: ApiPrefix.FindRemainingParkingSpace
    })
    .then(res => res.data)
}
