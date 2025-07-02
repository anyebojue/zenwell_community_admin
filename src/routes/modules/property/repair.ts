import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const repair: IRouter[] = [
  {
    path: '/repair',
    element: null,
    meta: {
      title: '报修管理',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'RepairSettings',
        element: load('Property/Repair/RepairSettings'),
        meta: {
          title: '报修设置'
        }
      },
      {
        path: 'RepairStaff',
        element: load('Property/Repair/RepairStaff'),
        meta: {
          title: '绑定维修师傅',
          hidden: true
        }
      },
      {
        path: 'PhoneRepair',
        element: load('Property/Repair/PhoneRepair'),
        meta: {
          title: '电话报修'
        }
      },
      {
        path: 'WorkOrderPool',
        element: load('Property/Repair/WorkOrderPool'),
        meta: {
          title: '工单池'
        }
      },
      {
        path: 'RepairTodo',
        element: load('Property/Repair/RepairTodo'),
        meta: {
          title: '报修待办'
        }
      },
      {
        path: 'RepairCompleted',
        element: load('Property/Repair/RepairCompleted'),
        meta: {
          title: '报修已办'
        }
      },
      {
        path: 'RepairFollowUp',
        element: load('Property/Repair/RepairFollowUp'),
        meta: {
          title: '报修回访'
        }
      },
      {
        path: 'ForceReceipt',
        element: load('Property/Repair/ForceReceipt'),
        meta: {
          title: '强制回单'
        }
      },
      {
        path: 'WorkOrderDetails',
        element: load('Property/Repair/WorkOrderDetails'),
        meta: {
          title: '工单详情',
          hidden: true
        }
      }
    ]
  }
]

export default repair
