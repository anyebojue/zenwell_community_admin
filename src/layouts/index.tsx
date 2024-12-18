import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRoutes, useLocation, useNavigate } from 'react-router-dom'
import type { IRouter } from 'routes'
import routesConfig from 'routes'
import useDynamicTabs from 'hooks/useDynamicTabs'
import { getUserInfo, permissionMenuPaths } from 'modules/global'
import { CssBaseline, Box, Stack, Tabs, Tab } from '@mui/material'
import { Close } from '@mui/icons-material'
import AppTheme from 'theme/AppTheme'
import message from 'components/Message'
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations
} from 'theme/customizations'
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
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const convertedRoutes = convertRoutes(routesConfig as IRouter[])
  const routing = useRoutes(convertedRoutes)
  const info = useSelector((state: RootState) => state.info.userInfo)
  const isFullPage = convertedRoutes.some(
    route => route.path === window.location.pathname && route.isFullPage
  )
  const { tabs, activeTabIndex, handleTabChange, handleTabClose } = useDynamicTabs(convertedRoutes)

  // 根据窗口尺寸动态设置菜单显示状态
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsMenuOpen(false)
      } else {
        setIsMenuOpen(true)
      }
    }
    // 初次加载时根据窗口大小设置菜单状态
    handleResize()
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    // 清除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('zenwell_token')
    // 检查token
    if ((!token || token === '') && !isLoginPage) {
      message.warning('登录状态已过期，请重新登录')
      navigate('/login')
      return
    }
    // 检查用户信息
    if (token && token !== '' && info.id === '') {
      dispatch(getUserInfo())
      return
    }
    // 检查权限
    if (info.id !== '' && !isLoginPage) {
      const paths = permissionMenuPaths(info.permission.menus)
      console.log(paths)
      // if (paths.length === 0) {
      //   navigate('/login')
      //   return
      // }
      // if (!paths.includes(location.pathname)) {
      //   navigate(paths[0])
      // }
    }
  }, [dispatch, navigate, info, isLoginPage, location.pathname])

  return (
    <AppTheme disableCustomTheme={disableCustomTheme} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      {!isFullPage ? (
        <Box sx={{ display: 'flex', height: '100%' }}>
          <SideMenu isMenuOpen={isMenuOpen} />
          <Stack sx={{ width: '100%', height: '100%' }}>
            <Header isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(prev => !prev)} />
            <Tabs
              sx={{ mt: '70px' }}
              value={activeTabIndex}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              {tabs.map((tab, index) => (
                <Tab
                  sx={{ pl: 3, pr: 2 }}
                  key={tab.id}
                  label={
                    <Box display="flex" alignItems="center">
                      {tab.label}
                      <Close
                        sx={{ ml: 0.5, fontSize: '16px' }}
                        onClick={e => {
                          e.stopPropagation()
                          handleTabClose(tab.id)
                        }}
                      />
                    </Box>
                  }
                  value={index}
                />
              ))}
            </Tabs>
            <Box sx={{ px: 3, pb: 3, bgcolor: 'background.paper' }}>{routing}</Box>
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
