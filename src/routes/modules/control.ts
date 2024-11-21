import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic'
import { load } from '../load'
import { IRouter } from '../index'

const control: IRouter[] = [
  {
    path: '/control',
    element: load('Control'),
    meta: {
      title: '首页',
      Icon: AutoAwesomeMosaicIcon,
      single: true
    }
  }
]

export default control
