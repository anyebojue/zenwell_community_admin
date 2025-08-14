import BadgeIcon from '@mui/icons-material/Badge'
import { load } from '../../load'
import { IRouter } from '../../index'

const purchase: IRouter[] = [
  {
    path: '/purchase',
    element: null,
    meta: {
      title: '物资管理',
      Icon: BadgeIcon,
      single: false
    },
    children: [
      {
        path: 'ApprovalConfig',
        element: load('Property/Purchase/ApprovalConfig'),
        meta: {
          title: '审批配置'
        }
      },
      {
        path: 'WarehouseInfo',
        element: load('Property/Purchase/WarehouseInfo'),
        meta: {
          title: '仓库信息'
        }
      },
      {
        path: 'ItemType',
        element: load('Property/Purchase/ItemType'),
        meta: {
          title: '物品类型'
        }
      },
      {
        path: 'SecondaryClassification',
        element: load('Property/Purchase/SecondaryClassification'),
        meta: {
          title: '二级分类',
          hidden: true
        }
      },
      {
        path: 'ItemSpec',
        element: load('Property/Purchase/ItemSpec'),
        meta: {
          title: '物品规格'
        }
      },
      {
        path: 'ItemInfo',
        element: load('Property/Purchase/ItemInfo'),
        meta: {
          title: '物品信息'
        }
      },
      {
        path: 'Supplier',
        element: load('Property/Purchase/Supplier'),
        meta: {
          title: '物品供应商'
        }
      },
      {
        path: 'PurchaseRequest',
        element: load('Property/Purchase/PurchaseRequest'),
        meta: {
          title: '采购申请'
        }
      },
      {
        path: 'Procurement',
        element: load('Property/Purchase/Procurement'),
        meta: {
          title: '申请采购',
          hidden: true
        }
      },
      {
        path: 'UrgentProcurement',
        element: load('Property/Purchase/UrgentProcurement'),
        meta: {
          title: '紧急采购',
          hidden: true
        }
      },
      {
        path: 'ItemRequisition',
        element: load('Property/Purchase/ItemRequisition'),
        meta: {
          title: '物品领用'
        }
      },
      {
        path: 'InOutStockDetails',
        element: load('Property/Purchase/InOutStockDetails'),
        meta: {
          title: '出入库明细'
        }
      },
      {
        path: 'TransferRequest',
        element: load('Property/Purchase/TransferRequest'),
        meta: {
          title: '调拔申请'
        }
      },
      {
        path: 'TransferDetails',
        element: load('Property/Purchase/TransferDetails'),
        meta: {
          title: '调拔明细'
        }
      },
      {
        path: 'InventoryManagement',
        element: load('Property/Purchase/InventoryManagement'),
        meta: {
          title: '盘点管理'
        }
      },
      {
        path: 'MyItems',
        element: load('Property/Purchase/MyItems'),
        meta: {
          title: '我的物品'
        }
      },
      {
        path: 'DonationRecord',
        element: load('Property/Purchase/DonationRecord'),
        meta: {
          title: '转赠记录'
        }
      },
      {
        path: 'UsageRecord',
        element: load('Property/Purchase/UsageRecord'),
        meta: {
          title: '使用记录'
        }
      }
    ]
  }
]

export default purchase
