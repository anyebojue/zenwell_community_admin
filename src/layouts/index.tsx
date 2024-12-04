import { useState } from 'react'
import { useRoutes } from 'react-router-dom'
import { CssBaseline, Box, Stack, Tabs, Tab } from '@mui/material'
import routes, { IRouter } from 'routes'
import { Close } from '@mui/icons-material'
import AppTheme from 'theme/AppTheme'
import useDynamicTabs from 'hooks/useDynamicTabs'
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
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const convertedRoutes = convertRoutes(routes as IRouter[])
  const routing = useRoutes(convertedRoutes)
  const isFullPage = convertedRoutes.some(
    route => route.path === window.location.pathname && route.isFullPage
  )
  const { tabs, activeTabIndex, handleTabChange, handleTabClose } = useDynamicTabs(convertedRoutes)

  return (
    <AppTheme disableCustomTheme={disableCustomTheme} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      {!isFullPage ? (
        <Box sx={{ display: 'flex', height: '100%' }}>
          <SideMenu isMenuOpen={isMenuOpen} />
          <Stack sx={{ width: '100%', height: '100%' }}>
            <Header isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(prev => !prev)} />
            <Tabs
              sx={{ mt: '60px' }}
              value={activeTabIndex}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  label={
                    <Box display="flex" alignItems="center">
                      {tab.label}
                      <Close
                        fontSize="small"
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
