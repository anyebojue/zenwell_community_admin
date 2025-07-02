import { HomeWork } from '@mui/icons-material'
import { load } from '../../load'
import { IRouter } from '../../index'

const propertyCompany: IRouter[] = [
  {
    path: '/propertyCompany',
    element: null,
    meta: {
      title: '物业公司',
      Icon: HomeWork
    },
    children: [
      {
        path: '/propertyCompany',
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
