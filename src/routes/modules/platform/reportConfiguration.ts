import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const reportConfiguration: IRouter[] = [
  {
    path: '/ReportConfiguration',
    element: null,
    meta: {
      title: '报表配置',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'ReportGroup',
        element: load('Platform/ReportConfiguration/ReportGroup'),
        meta: {
          title: '报表组'
        }
      },
      {
        path: 'ReportInfo',
        element: load('Platform/ReportConfiguration/ReportInfo'),
        meta: {
          title: '报表信息'
        }
      },
      {
        path: 'AssociatedComponent',
        element: load('Platform/ReportConfiguration/AssociatedComponent'),
        meta: {
          title: '报表组',
          hidden: true
        }
      },
      {
        path: 'ReportComponent',
        element: load('Platform/ReportConfiguration/ReportComponent'),
        meta: {
          title: '报表组件'
        }
      },
      {
        path: 'SetCondition',
        element: load('Platform/ReportConfiguration/SetCondition'),
        meta: {
          title: '设置条件',
          hidden: true
        }
      },
      {
        path: 'BottomStatistics',
        element: load('Platform/ReportConfiguration/BottomStatistics'),
        meta: {
          title: '底部统计',
          hidden: true
        }
      }
    ]
  }
]

export default reportConfiguration
