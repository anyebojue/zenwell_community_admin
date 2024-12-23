import { Apartment } from '@mui/icons-material'
import { load } from '../../load'
import { IRouter } from '../../index'

const menuRoute: IRouter[] = [
  {
    path: '/menu',
    element: load('Develop/Menu'),
    meta: {
      title: '配置菜单',
      Icon: Apartment,
      single: true
    }
  }
]

export default menuRoute
