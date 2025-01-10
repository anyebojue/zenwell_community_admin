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
        path: 'inspection-project',
        element: load('Property/Inspection/InspectionProject'),
        meta: {
          title: '巡检项目'
        }
      },
      {
        path: 'inspection-point',
        element: load('Property/Inspection/InspectionPoint'),
        meta: {
          title: '巡检点'
        }
      },
      {
        path: 'inspection-route',
        element: load('Property/Inspection/InspectionRoute'),
        meta: {
          title: '巡检路线'
        }
      },
      {
        path: 'inspection-plan',
        element: load('Property/Inspection/InspectionPlan'),
        meta: {
          title: '巡检计划'
        }
      },
      {
        path: 'inspection-task',
        element: load('Property/Inspection/InspectionTask'),
        meta: {
          title: '巡检任务'
        }
      },
      {
        path: 'inspection-detail',
        element: load('Property/Inspection/InspectionDetail'),
        meta: {
          title: '巡检明细'
        }
      }
    ]
  }
]

export default repair
