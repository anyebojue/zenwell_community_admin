import DashboardIcon from '@mui/icons-material/Dashboard'
import { load } from '../load'
import { IRouter } from '../index'

const control: IRouter[] = [
  {
    path: '/property-company',
    element: load('PropertyCompany'),
    meta: {
      title: '物业公司',
      Icon: DashboardIcon,
      single: true
    }
  }
]

export default control
