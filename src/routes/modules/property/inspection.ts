import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const repair: IRouter[] = [
  {
    path: '/inspection',
    element: null,
    meta: {
      title: '巡检管理',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'InspectionProject',
        element: load('Property/Inspection/InspectionProject'),
        meta: {
          title: '巡检项目'
        }
      },
      {
        path: 'InspectionSpection',
        element: load('Property/Inspection/InspectionSpection'),
        meta: {
          title: '巡检题目',
          hidden: true
        }
      },
      {
        path: 'InspectionPoint',
        element: load('Property/Inspection/InspectionPoint'),
        meta: {
          title: '巡检点'
        }
      },
      {
        path: 'InspectionRoute',
        element: load('Property/Inspection/InspectionRoute'),
        meta: {
          title: '巡检路线'
        }
      },
      {
        path: 'InspectionPlan',
        element: load('Property/Inspection/InspectionPlan'),
        meta: {
          title: '巡检计划'
        }
      },
      {
        path: 'InspectionTask',
        element: load('Property/Inspection/InspectionTask'),
        meta: {
          title: '巡检任务'
        }
      },
      {
        path: 'InspectionDetail',
        element: load('Property/Inspection/InspectionDetail'),
        meta: {
          title: '巡检明细'
        }
      },
      {
        path: 'InspectionPlanDetail',
        element: load('Property/Inspection/InspectionPlanDetail'),
        meta: {
          title: '巡检计划详情',
          hidden: true
        }
      },
      {
        path: 'InspectionTaskDetail',
        element: load('Property/Inspection/InspectionTaskDetail'),
        meta: {
          title: '巡检任务详情',
          hidden: true
        }
      }
    ]
  }
]

export default repair
