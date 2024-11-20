import { ComponentType } from 'react'
import { useRoutes, useLocation, Navigate } from 'react-router-dom'
import { CssBaseline, Box, Stack } from '@mui/material'
import AppTheme from 'theme/AppTheme'
import routes from 'routes'
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations
} from '../theme/customizations'
import AppNavbar from './components/AppNavbar'
import SideMenu from './components/SideMenu'
import Header from './components/Header/Header'

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations
}

interface RouteConfig {
  path: string
  redirect?: string
  Component?: ComponentType
  children?: RouteConfig[]
  isFullPage?: boolean
}

const convertRoutes = (routes: RouteConfig[]): RouteConfig[] =>
  routes.map(({ path, redirect, Component, children, isFullPage }) => ({
    path,
    element: redirect ? <Navigate to={redirect} replace /> : Component ? <Component /> : null,
    children: children ? convertRoutes(children) : undefined,
    isFullPage
  }))

const checkIsFullPage = (routes: RouteConfig[], pathname: string): boolean =>
  routes.some(({ path, isFullPage, children }) =>
    path === pathname ? isFullPage : children ? checkIsFullPage(children, pathname) : false
  )

const App = ({ disableCustomTheme }: { disableCustomTheme?: boolean }) => {
  const location = useLocation()
  const convertedRoutes = convertRoutes(routes as RouteConfig[])
  const routing = useRoutes(convertedRoutes)
  const isFullPage = checkIsFullPage(convertedRoutes, location.pathname)

  return (
    <AppTheme disableCustomTheme={disableCustomTheme} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100%' }}>
        {!isFullPage && <SideMenu />}
        <Stack sx={{ width: '100%', height: '100%' }}>
          {!isFullPage && <Header />}
          <Box sx={{ p: 3, bgcolor: 'background.paper', height: '100%' }}>{routing}</Box>
        </Stack>
        {!isFullPage && <AppNavbar />}
      </Box>
    </AppTheme>
  )
}

export default App
