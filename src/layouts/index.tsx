import { ComponentType } from 'react'
import { useRoutes, useLocation, Navigate } from 'react-router-dom'
import { CssBaseline, drawerClasses, Box, Stack } from '@mui/material'
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

  const renderMainContent = () => (
    <Box
      component="main"
      sx={{
        px: 3,
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper'
        }
      }}
    >
      {routing}
    </Box>
  )

  return (
    <AppTheme disableCustomTheme={disableCustomTheme} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        {!isFullPage && <SideMenu />}
        <Stack spacing={2}>
          {!isFullPage && <Header />}
          {renderMainContent()}
        </Stack>
        {!isFullPage && <AppNavbar />}
      </Box>
    </AppTheme>
  )
}

export default App
