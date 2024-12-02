import { HomeWork } from '@mui/icons-material'
import { load } from '../load'
import { IRouter } from '../index'

const control: IRouter[] = [
  {
    path: '/property-company',
    element: load('PropertyCompany'),
    meta: {
      title: '物业公司',
      Icon: HomeWork,
      single: true
    }
  }
]

export default control
