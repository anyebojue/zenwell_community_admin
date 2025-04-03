import { Apartment } from '@mui/icons-material'
import { load } from '../../load'
import { IRouter } from '../../index'

const community: IRouter[] = [
  {
    path: '/community',
    element: load('Platform/Community'),
    meta: {
      title: '小区信息',
      Icon: Apartment,
      single: true
    }
  }
]

export default community
