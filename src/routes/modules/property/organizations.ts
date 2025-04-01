import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

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
        path: 'OrganizationInfo',
        element: load('Platform/Organization/OrganizationInfo'),
        meta: {
          title: '组织信息'
        }
      },
      {
        path: 'Employees',
        element: load('Platform/Organization/Employees'),
        meta: {
          title: '员工信息'
        }
      },
      {
        path: 'Roles',
        element: load('Platform/Organization/Roles'),
        meta: {
          title: '角色权限'
        }
      }
    ]
  }
]

export default organization
