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
      },
      {
        path: 'ExpenseDiscount',
        element: load('Property/FeeConfig/ExpenseDiscount'),
        meta: {
          hidden: true,
          title: '费用折扣'
        }
      },
      {
        path: 'DiscountSetting',
        element: load('Property/FeeConfig/DiscountSetting'),
        meta: {
          title: '折扣设置'
        }
      },
      {
        path: 'SharedFormula',
        element: load('Property/FeeConfig/SharedFormula'),
        meta: {
          title: '公摊公式'
        }
      }
    ]
  }
]

export default feeConfig
