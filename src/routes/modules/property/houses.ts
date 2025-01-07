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
      },
      {
        path: 'CheckIn',
        element: load('Property/Houses/CheckIn'),
        meta: {
          title: '交房',
          hidden: true
        }
      },
      {
        path: 'CheckOut',
        element: load('Property/Houses/CheckOut'),
        meta: {
          title: '退房',
          hidden: true
        }
      },
      {
        path: 'OwnerInformation',
        element: load('Property/Houses/OwnerInformation'),
        meta: {
          title: '业主信息'
        }
      },
      {
        path: 'OwnerMember',
        element: load('Property/Houses/OwnerMember'),
        meta: {
          title: '业主成员'
        }
      }
    ]
  }
]

export default houses
