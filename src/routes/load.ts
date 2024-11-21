import LoadComponent from 'layouts/components/LoadComponent'
import { lazy } from 'react'

const load = (component: string) => LoadComponent(lazy(() => import(`pages/${component}`)))

export default load
