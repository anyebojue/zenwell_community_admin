import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import { load } from '../../load'
import { IRouter } from '../../index'

const organization: IRouter[] = [
  {
    path: '/systemSetting',
    element: null,
    meta: {
      title: '系统设置',
      Icon: BuildCircleIcon,
      single: false
    },
    children: [
      {
        path: 'change-password',
        element: load('Platform/SystemSetting/ChangePassword'),
        meta: {
          title: '修改密码'
        }
      }
    ]
  }
]

export default organization
