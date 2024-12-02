import { Apartment } from '@mui/icons-material'
import { load } from '../load'
import { IRouter } from '../index'

const cellInformation: IRouter[] = [
  {
    path: '/cellInformation',
    element: load('CellInformation'),
    meta: {
      title: '小区信息',
      Icon: Apartment,
      single: true
    }
  }
]

export default cellInformation
