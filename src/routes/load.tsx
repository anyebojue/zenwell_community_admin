import { lazy } from 'react'
import LoadComponent from 'layouts/components/LoadComponent'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const load = (component: string) => {
  const LazyComponent = lazy(() => import(`pages/${component}`))

  return <LoadComponent component={LazyComponent} />
}

const NavigateIndex: React.FC = () => {
  const info = useSelector((state: RootState) => state.info.userInfo)

  switch (info.platform) {
    case '2':
      return <Navigate to="/menu" replace />
    case '1':
      return <Navigate to="/control" replace />
    case '0':
      return <Navigate to="/communitys/my-communitys" replace />
    default:
      return null
  }
}

export { load, NavigateIndex }
