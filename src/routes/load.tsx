import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import LoadComponent from 'layouts/components/LoadComponent'

const load = (component: string) => LoadComponent(lazy(() => import(`pages/${component}`)))

const navigateIndex = <Navigate to="/control" replace />

export { load, navigateIndex }
