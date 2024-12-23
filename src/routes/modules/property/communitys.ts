import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const communitys: IRouter[] = [
  {
    path: '/communitys',
    element: null,
    meta: {
      title: '小区',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'my-communitys',
        element: load('Property/Communitys/MyCommunity'),
        meta: {
          title: '我的小区'
        }
      }
    ]
  }
]

export default communitys
