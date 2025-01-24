import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const communitys: IRouter[] = [
  {
    path: '/communitys',
    element: null,
    meta: {
      title: '小区管理',
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
      },
      {
        path: 'house-decoration',
        element: load('Property/Communitys/HouseDecoration'),
        meta: {
          title: '房屋装修'
        }
      },
      {
        path: 'TraceRecord',
        element: load('Property/Communitys/TraceRecord'),
        meta: {
          title: '跟踪记录',
          hidden: true
        }
      },
      {
        path: 'AcceptanceDetail',
        element: load('Property/Communitys/AcceptanceDetail'),
        meta: {
          title: '验收明细',
          hidden: true
        }
      },
      {
        path: 'community-announcement',
        element: load('Property/Communitys/CommunityAnnouncement'),
        meta: {
          title: '小区公示'
        }
      }
    ]
  }
]

export default communitys
