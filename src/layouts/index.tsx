import { useRoutes, useLocation } from 'react-router-dom'
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
  routes.map(({ path, element, children }) => ({
    path,
    element,
    children: children ? convertRoutes(children) : undefined
  }))

// 检查是否为全屏页面
const checkIsFullPage = (routes: IRouter[], pathname: string): boolean =>
  routes.some(({ path, isFullPage, children }) =>
    path === pathname ? isFullPage || false : children ? checkIsFullPage(children, pathname) : false
  )

const App = ({ disableCustomTheme }: { disableCustomTheme?: boolean }) => {
  const location = useLocation()

  // 转换路由
  const convertedRoutes = convertRoutes(routes as IRouter[])
  const routing = useRoutes(convertedRoutes)

  // 判断当前页面是否是全屏页面
  const isFullPage = checkIsFullPage(convertedRoutes, location.pathname)

  return (
    <AppTheme disableCustomTheme={disableCustomTheme} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* 非全屏页面显示侧边栏 */}
        {!isFullPage && <SideMenu />}
        <Stack sx={{ width: '100%', height: '100%' }}>
          {/* 非全屏页面显示头部 */}
          {!isFullPage && <Header />}
          <Box sx={{ p: 3, bgcolor: 'background.paper', height: '100%' }}>{routing}</Box>
        </Stack>
        {/* 非全屏页面显示导航栏 */}
        {!isFullPage && <AppNavbar />}
      </Box>
    </AppTheme>
  )
}

export default App
