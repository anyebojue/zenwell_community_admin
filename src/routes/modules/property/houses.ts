import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const houses: IRouter[] = [
  {
    path: '/houses',
    element: null,
    meta: {
      title: '房产管理',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'HousingManagement',
        element: load('Property/Houses/HousingManagement'),
        meta: {
          title: '房屋管理'
        }
      }
    ]
  }
]

export default houses
