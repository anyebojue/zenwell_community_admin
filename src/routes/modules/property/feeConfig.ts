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
        path: 'HousingCharge',
        element: load('Property/FeeConfig/HousingCharge'),
        meta: {
          title: '房屋收费'
        }
      },
      {
        path: 'MeterType',
        element: load('Property/FeeConfig/MeterType'),
        meta: {
          title: '抄表类型'
        }
      },
      {
        path: 'MeterWater',
        element: load('Property/FeeConfig/MeterWater'),
        meta: {
          title: '水电抄表'
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
