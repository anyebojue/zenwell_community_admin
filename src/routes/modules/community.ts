import { lazy } from 'react'
import ApartmentIcon from '@mui/icons-material/Apartment'
import { IRouter } from '../index'

const CommunityComponent = lazy(() => import('pages/Community/MyCommunity'))

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
        Component: CommunityComponent,
        meta: {
          title: '我的小区'
        }
      },
      {
        path: 'business',
        Component: CommunityComponent,
        meta: {
          title: '业务受理'
        }
      },
      {
        path: 'big-screen',
        Component: CommunityComponent,
        meta: {
          title: '小区大屏'
        }
      },
      {
        path: 'decoration',
        Component: CommunityComponent,
        meta: {
          title: '房屋装修'
        }
      },
      {
        path: 'structure-diagram',
        Component: CommunityComponent,
        meta: {
          title: '结构图'
        }
      },
      {
        path: 'parking-structure',
        Component: CommunityComponent,
        meta: {
          title: '车位结构图'
        }
      },
      {
        path: 'property-registration',
        Component: CommunityComponent,
        meta: {
          title: '产权登记'
        }
      },
      {
        path: 'video-surveillance',
        Component: CommunityComponent,
        meta: {
          title: '视频监控'
        }
      },
      {
        path: 'pass-type',
        Component: CommunityComponent,
        meta: {
          title: '放行类型'
        }
      },
      {
        path: 'goods-release',
        Component: CommunityComponent,
        meta: {
          title: '物品放行'
        }
      },
      {
        path: 'community-publicity',
        Component: CommunityComponent,
        meta: {
          title: '小区公示'
        }
      }
    ]
  }
]

export default community
