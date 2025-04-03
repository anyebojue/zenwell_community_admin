import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const parking: IRouter[] = [
  {
    path: '/parking',
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
      },
      {
        path: 'ParkingMonthlyCard',
        element: load('Property/Parking/ParkingMonthlyCard'),
        meta: {
          title: '停车月卡'
        }
      },
      {
        path: 'MonthlyCardOrder',
        element: load('Property/Parking/MonthlyCardOrder'),
        meta: {
          title: '月卡订单'
        }
      },
      {
        path: 'EntryRecord',
        element: load('Property/Parking/EntryRecord'),
        meta: {
          title: '进场记录'
        }
      },
      {
        path: 'ParkedVehicles',
        element: load('Property/Parking/ParkedVehicles'),
        meta: {
          title: '在场车辆'
        }
      },
      {
        path: 'AvailableParkingSpaces',
        element: load('Property/Parking/AvailableParkingSpaces'),
        meta: {
          title: '剩余车位'
        }
      },
      {
        path: 'BlackWhiteList',
        element: load('Property/Parking/BlackWhiteList'),
        meta: {
          title: '黑白名单'
        }
      },
      {
        path: 'SurveillanceCamera',
        element: load('Property/Parking/SurveillanceCamera'),
        meta: {
          title: '摄像头管理'
        }
      },
      {
        path: 'ParkingSpaceApplication',
        element: load('Property/Parking/ParkingSpaceApplication'),
        meta: {
          title: '车位申请'
        }
      },
      {
        path: 'TemporaryVehiclePayment',
        element: load('Property/Parking/TemporaryVehiclePayment'),
        meta: {
          title: '临时车缴费'
        }
      }
    ]
  }
]

export default parking
