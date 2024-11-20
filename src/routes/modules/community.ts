import { lazy } from 'react'
import ApartmentIcon from '@mui/icons-material/Apartment'
import { IRouter } from '../index'

const MyCommunity = lazy(() => import('pages/Community/MyCommunity'))
const Business = lazy(() => import('pages/Community/Business'))

const community: IRouter[] = [
  {
    path: '/community',
    meta: {
      title: '小区',
      Icon: ApartmentIcon
    },
    children: [
      {
        path: 'my-community',
        Component: MyCommunity,
        meta: {
          title: '我的小区'
        }
      },
      {
        path: 'business',
        Component: Business,
        meta: {
          title: '业务受理'
        }
      },
      {
        path: 'big-screen',
        Component: Business,
        meta: {
          title: '小区大屏'
        }
      },
      {
        path: 'decoration',
        Component: Business,
        meta: {
          title: '房屋装修'
        }
      },
      {
        path: 'structure-diagram',
        Component: Business,
        meta: {
          title: '结构图'
        }
      },
      {
        path: 'parking-structure',
        Component: Business,
        meta: {
          title: '车位结构图'
        }
      },
      {
        path: 'property-registration',
        Component: Business,
        meta: {
          title: '产权登记'
        }
      },
      {
        path: 'video-surveillance',
        Component: Business,
        meta: {
          title: '视频监控'
        }
      },
      {
        path: 'pass-type',
        Component: Business,
        meta: {
          title: '放行类型'
        }
      },
      {
        path: 'goods-release',
        Component: Business,
        meta: {
          title: '物品放行'
        }
      },
      {
        path: 'community-publicity',
        Component: Business,
        meta: {
          title: '小区公示'
        }
      }
    ]
  }
]

export default community
