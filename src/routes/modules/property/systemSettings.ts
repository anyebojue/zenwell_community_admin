import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import { load } from '../../load'
import { IRouter } from '../../index'

const systemSettings: IRouter[] = [
  {
    path: '/SystemSetting',
    element: null,
    meta: {
      title: '系统设置',
      Icon: BuildCircleIcon,
      single: false
    },
    children: [
      {
        path: 'CellAllocation',
        element: load('Property/SystemSettings/CellAllocation'),
        meta: {
          title: '小区配置'
        }
      },
      {
        path: 'SmallProgramConfiguration',
        element: load('Property/SystemSettings/SmallProgramConfiguration'),
        meta: {
          title: '小程序配置'
        }
      },
      {
        path: 'PaymentAllocation',
        element: load('Property/SystemSettings/PaymentAllocation'),
        meta: {
          title: '支付配置'
        }
      },
      {
        path: 'ChangePassword',
        element: load('Property/SystemSettings/ChangePassword'),
        meta: {
          title: '修改密码'
        }
      }
    ]
  }
]

export default systemSettings
