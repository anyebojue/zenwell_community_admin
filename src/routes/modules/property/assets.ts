import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { load } from '../../load'
import { IRouter } from '../../index'

const assets: IRouter[] = [
  {
    path: '/assets',
    element: null,
    meta: {
      title: '资产管理',
      Icon: Inventory2OutlinedIcon,
      single: false
    },
    children: [
      {
        path: 'AssetPortal',
        element: load('Property/Assets/AssetPortal'),
        meta: {
          title: '资产门户'
        }
      },
      {
        path: 'AssetManagement',
        element: load('Property/Assets/AssetManagement'),
        meta: {
          title: '资产管理'
        }
      },
      {
        path: 'AssetCard',
        element: load('Property/Assets/AssetCard'),
        meta: {
          title: '资产卡片'
        }
      },
      {
        path: 'AssetOperation',
        element: load('Property/Assets/AssetOperation'),
        meta: {
          title: '资产经营'
        }
      },
      {
        path: 'AssetDepreciation',
        element: load('Property/Assets/AssetDepreciation'),
        meta: {
          title: '资产折旧'
        }
      },
      {
        path: 'AssetDisposal',
        element: load('Property/Assets/AssetDisposal'),
        meta: {
          title: '资产处置'
        }
      },
      {
        path: 'AssetVoucher',
        element: load('Property/Assets/AssetVoucher'),
        meta: {
          title: '资产凭证'
        }
      },
      {
        path: 'AssetSharing',
        element: load('Property/Assets/AssetSharing'),
        meta: {
          title: '资产共享'
        }
      },
      {
        path: 'AssetWarning',
        element: load('Property/Assets/AssetWarning'),
        meta: {
          title: '资产预警'
        }
      },
      {
        path: 'AssetSupervision',
        element: load('Property/Assets/AssetSupervision'),
        meta: {
          title: '资产监管'
        }
      },
      {
        path: 'IntangibleAsset',
        element: load('Property/Assets/IntangibleAsset'),
        meta: {
          title: '无形资产'
        }
      },
      {
        path: 'MobileAsset',
        element: load('Property/Assets/MobileAsset'),
        meta: {
          title: '移动端应用'
        }
      }
    ]
  }
]

export default assets
