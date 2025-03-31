import { HomeWork } from '@mui/icons-material'
import { load } from '../../load'
import { IRouter } from '../../index'

const propertyCompany: IRouter[] = [
  {
    path: '/PropertyCompany',
    element: null,
    meta: {
      title: '物业公司',
      Icon: HomeWork
    },
    children: [
      {
        path: '/PropertyCompany',
        element: load('Platform/PropertyCompany'),
        meta: {
          title: '物业公司',
          hidden: true
        }
      },
      {
        path: 'Company',
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
