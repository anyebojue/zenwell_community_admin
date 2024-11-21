import { useRoutes } from 'react-router-dom'
import { CssBaseline, Box, Stack } from '@mui/material'
import AppTheme from 'theme/AppTheme'
import routes, { IRouter } from 'routes'
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations
} from '../theme/customizations'
import AppNavbar from './components/AppNavbar'
import SideMenu from './components/SideMenu'
import Header from './components/Header/Header'

// 合并自定义主题组件
const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations
}

// 转换路由配置为 React Router 格式
const convertRoutes = (routes: IRouter[]): IRouter[] =>
  routes.map(route => ({
    ...route,
    children: route.children ? convertRoutes(route.children) : undefined // 递归处理子路由
  }))

const App = ({ disableCustomTheme }: { disableCustomTheme?: boolean }) => {
  const convertedRoutes = convertRoutes(routes as IRouter[])
  const routing = useRoutes(convertedRoutes)
  const isFullPage = convertedRoutes.some(route => {
    return route.path === window.location.pathname && route.isFullPage
  })

  return (
    <AppTheme disableCustomTheme={disableCustomTheme} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      {!isFullPage ? (
        <Box sx={{ display: 'flex', height: '100%' }}>
          <SideMenu />
          <Stack sx={{ width: '100%', height: '100%' }}>
            <Header />
            <Box sx={{ p: 3, bgcolor: 'background.paper', height: '100%' }}>{routing}</Box>
          </Stack>
          <AppNavbar />
        </Box>
      ) : (
        routing
      )}
    </AppTheme>
  )
}

export default App
