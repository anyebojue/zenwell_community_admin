import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import LoadComponent from 'layouts/components/LoadComponent'

const load = (component: string) => {
  try {
    return LoadComponent(lazy(() => import(`pages/${component}`)))
  } catch (error) {
    console.error(`Failed to load component: ${component}`, error)
    throw error
  }
}

const navigateIndex = <Navigate to="/control" replace />

export { load, navigateIndex }
