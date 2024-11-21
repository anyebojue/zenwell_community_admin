import ApartmentIcon from '@mui/icons-material/Apartment'
import { load } from 'routes/load'
import { IRouter } from '../index'

const community: IRouter[] = [
  {
    path: '/community',
    element: null,
    meta: {
      title: '小区',
      Icon: ApartmentIcon
    },
    children: [
      {
        path: '/community/my-community',
        element: load('Community/MyCommunity'),
        meta: {
          title: '我的小区'
        }
      },
      {
        path: '/community/business',
        element: load('Community/Business'),
        meta: {
          title: '业务受理'
        }
      },
      {
        path: '/community/big-screen',
        element: load('Community/Business'),
        meta: {
          title: '小区大屏'
        }
      },
      {
        path: '/community/decoration',
        element: load('Community/Business'),
        meta: {
          title: '房屋装修'
        }
      },
      {
        path: '/community/structure-diagram',
        element: load('Community/Business'),
        meta: {
          title: '结构图'
        }
      },
      {
        path: '/community/parking-structure',
        element: load('Community/Business'),
        meta: {
          title: '车位结构图'
        }
      },
      {
        path: '/community/property-registration',
        element: load('Community/Business'),
        meta: {
          title: '产权登记'
        }
      },
      {
        path: '/community/video-surveillance',
        element: load('Community/Business'),
        meta: {
          title: '视频监控'
        }
      },
      {
        path: '/community/pass-type',
        element: load('Community/Business'),
        meta: {
          title: '放行类型'
        }
      },
      {
        path: '/community/goods-release',
        element: load('Community/Business'),
        meta: {
          title: '物品放行'
        }
      },
      {
        path: '/community/community-publicity',
        element: load('Community/Business'),
        meta: {
          title: '小区公示'
        }
      }
    ]
  }
]

export default community
