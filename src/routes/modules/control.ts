import { lazy } from 'react'
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic'
import { IRouter } from '../index'

const control: IRouter[] = [
  {
    path: '/control',
    Component: lazy(() => import('pages/Control')),
    meta: {
      title: '首页',
      Icon: AutoAwesomeMosaicIcon,
      single: true
    }
  }
]

export default control
