import { HomeWork } from '@mui/icons-material'
import { load } from '../../load'
import { IRouter } from '../../index'

const propertyCompany: IRouter[] = [
  {
    path: '/property-company',
    element: null,
    meta: {
      title: '物业公司',
      Icon: HomeWork
    },
    children: [
      {
        path: '/property-company',
        element: load('Platform/PropertyCompany'),
        meta: {
          title: '物业公司',
          hidden: true
        }
      },
      {
        path: '/property-company/company',
        element: load('Platform/PropertyCompany/Company'),
        meta: {
          title: '加入的小区信息',
          hidden: true
        }
      }
    ]
  }
]

export default propertyCompany
