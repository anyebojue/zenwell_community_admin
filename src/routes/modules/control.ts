import Home from '@mui/icons-material/Home'
import { load } from '../load'
import { IRouter } from '../index'

const control: IRouter[] = [
  {
    path: '/control',
    element: load('Control'),
    meta: {
      title: '首页',
      Icon: Home,
      single: true
    }
  }
]

export default control
