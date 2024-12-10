import BadgeIcon from '@mui/icons-material/Badge'
import { load } from 'routes/load'
import { IRouter } from '../index'

const organization: IRouter[] = [
  {
    path: '/organization',
    element: null,
    meta: {
      title: '组织设置',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: '/organization/info',
        element: load('Organization/Info'),
        meta: {
          title: '组织信息'
        }
      },
      {
        path: '/organization/employees',
        element: load('Organization/Employees'),
        meta: {
          title: '员工信息'
        }
      },
      {
        path: '/organization/roles',
        element: load('Organization/Roles'),
        meta: {
          title: '角色权限'
        }
      }
    ]
  }
]

export default organization
