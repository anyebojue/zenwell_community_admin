import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import { load } from '../../load'
import { IRouter } from '../../index'

const feeConfig: IRouter[] = [
  {
    path: '/FeeConfig',
    element: null,
    meta: {
      title: '费用设置',
      Icon: BuildCircleIcon,
      single: false
    },
    children: [
      {
        path: 'FeeItemConfig',
        element: load('Property/FeeConfig/FeeItemConfig'),
        meta: {
          title: '费用项设置'
        }
      }
    ]
  }
]

export default feeConfig
