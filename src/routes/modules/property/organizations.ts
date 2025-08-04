import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const organizations: IRouter[] = [
  {
    path: '/organizations',
    element: null,
    meta: {
      title: '组织设置',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'OrganizationInfo',
        element: load('Property/Organization/OrganizationInfo'),
        meta: {
          title: '组织信息'
        }
      },
      {
        path: 'Employees',
        element: load('Property/Organization/Employees'),
        meta: {
          title: '员工信息'
        }
      },
      {
        path: 'EmployeesDetails',
        element: load('Property/Organization/EmployeesDetails'),
        meta: {
          title: '员工详情',
          hidden: true
        }
      },
      {
        path: 'Roles',
        element: load('Property/Organization/Roles'),
        meta: {
          title: '角色权限'
        }
      }
    ]
  }
]

export default organizations
