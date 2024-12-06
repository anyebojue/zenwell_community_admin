import { Apartment } from '@mui/icons-material'
import { load } from '../load'
import { IRouter } from '../index'

const communityRoute: IRouter[] = [
  {
    path: '/community',
    element: load('Community'),
    meta: {
      title: '小区信息',
      Icon: Apartment,
      single: true
    }
  }
]

export default communityRoute
