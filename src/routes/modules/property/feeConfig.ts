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
        path: 'ExpenseItemInformation',
        element: load('Property/FeeConfig/ExpenseItemInformation'),
        meta: {
          hidden: true,
          title: '费用项信息'
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
        path: 'HousingFeePackage',
        element: load('Property/FeeConfig/HousingFeePackage'),
        meta: {
          hidden: true,
          title: '根据费用套餐创建'
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
        path: 'ReturnAudit',
        element: load('Property/FeeConfig/ReturnAudit'),
        meta: {
          title: '退费审核'
        }
      },
      {
        path: 'RefundDetails',
        element: load('Property/FeeConfig/RefundDetails'),
        meta: {
          hidden: true,
          title: '退费详情'
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
        path: 'DiscountType',
        element: load('Property/FeeConfig/DiscountType'),
        meta: {
          title: '优惠类型'
        }
      },
      {
        path: 'DiscountApplication',
        element: load('Property/FeeConfig/DiscountApplication'),
        meta: {
          title: '优惠申请'
        }
      },
      {
        path: 'TraceRecord',
        element: load('Property/FeeConfig/TraceRecord'),
        meta: {
          hidden: true,
          title: '跟踪记录'
        }
      },
      {
        path: 'ReprintReceipt',
        element: load('Property/FeeConfig/ReprintReceipt'),
        meta: {
          title: '补打收据'
        }
      },
      {
        path: 'SharedFormula',
        element: load('Property/FeeConfig/SharedFormula'),
        meta: {
          title: '公摊公式'
        }
      },
      {
        path: 'CostIntroduction',
        element: load('Property/FeeConfig/CostIntroduction'),
        meta: {
          title: '费用导入'
        }
      },
      {
        path: 'ImportFeeDetails',
        element: load('Property/FeeConfig/ImportFeeDetails'),
        meta: {
          hidden: true,
          title: '导入费用详情'
        }
      },
      {
        path: 'FeePackage',
        element: load('Property/FeeConfig/FeePackage'),
        meta: {
          title: '费用套餐'
        }
      },
      {
        path: 'ExpenseItem',
        element: load('Property/FeeConfig/ExpenseItem'),
        meta: {
          hidden: true,
          title: '费用项'
        }
      },
      {
        path: 'PaymentAudit',
        element: load('Property/FeeConfig/PaymentAudit'),
        meta: {
          title: '缴费审核'
        }
      },
      {
        path: 'CancellationFee',
        element: load('Property/FeeConfig/CancellationFee'),
        meta: {
          title: '取消费用'
        }
      },
      {
        path: 'ArrearsInformation',
        element: load('Property/FeeConfig/ArrearsInformation'),
        meta: {
          title: '欠费信息'
        }
      },
      {
        path: 'CallForArrears',
        element: load('Property/FeeConfig/CallForArrears'),
        meta: {
          title: '欠费催缴'
        }
      }
    ]
  }
]

export default feeConfig
