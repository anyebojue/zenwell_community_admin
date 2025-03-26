import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const repair: IRouter[] = [
  {
    path: '/Parking',
    element: null,
    meta: {
      title: '停车管理',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'ParkingLotManagement',
        element: load('Property/Parking/ParkingLotManagement'),
        meta: {
          title: '停车场管理'
        }
      },
      {
        path: 'ParkingSpaceInfo',
        element: load('Property/Parking/ParkingSpaceInfo'),
        meta: {
          title: '车位信息'
        }
      },
      {
        path: 'GuardBoothManagement',
        element: load('Property/Parking/GuardBoothManagement'),
        meta: {
          title: '岗亭管理'
        }
      },
      {
        path: 'OwnerVehicle',
        element: load('Property/Parking/OwnerVehicle'),
        meta: {
          title: '业主车辆'
        }
      }
    ]
  }
]

export default repair
