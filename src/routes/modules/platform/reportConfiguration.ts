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
        path: 'ReportComponent',
        element: load('Platform/ReportConfiguration/ReportComponent'),
        meta: {
          title: '报表组件'
        }
      }
    ]
  }
]

export default reportConfiguration
