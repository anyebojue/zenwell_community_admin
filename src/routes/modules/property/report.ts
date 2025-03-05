import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const communitys: IRouter[] = [
  {
    path: '/Report',
    element: null,
    meta: {
      title: '报表信息',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'ExpenseLedger',
        element: load('Property/Report/ExpenseLedger'),
        meta: {
          title: '费用台账'
        }
      },
      {
        path: 'SummaryOfExpenses',
        element: load('Property/Report/SummaryOfExpenses'),
        meta: {
          title: '费用汇总表'
        }
      },
      {
        path: 'ScheduleOfExpenses',
        element: load('Property/Report/ScheduleOfExpenses'),
        meta: {
          title: '费用明细表'
        }
      },
      {
        path: 'ExpenseReminder',
        element: load('Property/Report/ExpenseReminder'),
        meta: {
          title: '费用提醒'
        }
      },
      {
        path: 'DataStatistics',
        element: load('Property/Report/DataStatistics'),
        meta: {
          title: '数据统计'
        }
      },
      {
        path: 'ScheduleOfArrears',
        element: load('Property/Report/ScheduleOfArrears'),
        meta: {
          title: '欠费明细表'
        }
      },
      {
        path: 'PaymentSchedule',
        element: load('Property/Report/PaymentSchedule'),
        meta: {
          title: '缴费明细表'
        }
      },
      {
        path: 'SummaryOfRepairs',
        element: load('Property/Report/SummaryOfRepairs'),
        meta: {
          title: '报修汇总表'
        }
      },
      {
        path: 'UnchargedBuilding',
        element: load('Property/Report/UnchargedBuilding'),
        meta: {
          title: '未收费房屋'
        }
      },
      {
        path: 'OwnerPaymentDetails',
        element: load('Property/Report/OwnerPaymentDetails'),
        meta: {
          title: '业主缴费明细'
        }
      },
      {
        path: 'ArrearsAnalysis',
        element: load('Property/Report/ArrearsAnalysis'),
        meta: {
          title: '欠费分析'
        }
      },
      {
        path: 'DepositStatement',
        element: load('Property/Report/DepositStatement'),
        meta: {
          title: '押金报表'
        }
      },
      {
        path: 'RepairReport',
        element: load('Property/Report/RepairReport'),
        meta: {
          title: '报修报表'
        }
      },
      {
        path: 'OperatingStatement',
        element: load('Property/Report/OperatingStatement'),
        meta: {
          title: '营业报表'
        }
      },
      {
        path: 'InspectionReport',
        element: load('Property/Report/InspectionReport'),
        meta: {
          title: '巡检报表'
        }
      }
    ]
  }
]

export default communitys
