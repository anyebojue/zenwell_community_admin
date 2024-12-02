import DashboardIcon from '@mui/icons-material/Dashboard'
import { load } from '../load'
import { IRouter } from '../index'

const cellInformation: IRouter[] = [
  {
    path: '/cellInformation',
    element: load('CellInformation'),
    meta: {
      title: '小区信息',
      Icon: DashboardIcon,
      single: true
    }
  }
]

export default cellInformation
