import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import LoadComponent from 'layouts/components/LoadComponent'

const load = (component: string) => {
  const LazyComponent = lazy(() => import(`pages/${component}`))

  return <LoadComponent component={LazyComponent} />
}

const navigateIndex = <Navigate to="/control" replace />

export { load, navigateIndex }
