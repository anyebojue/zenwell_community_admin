import { useState, useEffect, SyntheticEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IRouter } from 'routes'

const useDynamicTabs = (routeList: IRouter[]) => {
  const navigate = useNavigate()
  const location = useLocation()

  // 默认首页标签
  const [tabs, setTabs] = useState<{ id: number; label: string; path: string }[]>([])
  const [activeTabIndex, setActiveTabIndex] = useState(0) // 默认激活首页

  // 获取路由标题
  const getRouteTitle = (path: string): string | undefined => {
    const findRouteTitle = (routes: IRouter[], basePath: string = ''): string | undefined => {
      for (const route of routes) {
        const fullPath = `${basePath}/${route.path}`.replace(/\/+/g, '/')
        if (fullPath === path) return route.meta?.title
        if (route.children) {
          const childTitle = findRouteTitle(route.children, fullPath)
          if (childTitle) return childTitle
        }
      }
      return undefined
    }
    return findRouteTitle(routeList)
  }

  // 监听路径变化，动态更新标签页
  useEffect(() => {
    const currentPath = location.pathname
    const title = getRouteTitle(currentPath)

    // 如果路径无效或标题未定义，或路径为首页，则不添加标签
    if (!title || currentPath === '/') {
      setActiveTabIndex(0) // 确保首页激活
      return
    }

    setTabs(prevTabs => {
      // 确保首页标签唯一
      const homeTabExists = prevTabs.some(tab => tab.path === '/')
      if (!homeTabExists) {
        prevTabs = [...prevTabs] // 首页标签一定在最前面
      }

      const existingTabIndex = prevTabs.findIndex(tab => tab.path === currentPath)
      if (existingTabIndex !== -1) {
        setActiveTabIndex(existingTabIndex)
        return prevTabs
      }

      setActiveTabIndex(prevTabs.length)
      return [...prevTabs, { id: Date.now(), label: title, path: currentPath }]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // 处理标签切换
  const handleTabChange = (_: SyntheticEvent, newIndex: number) => {
    setActiveTabIndex(newIndex)
    navigate(tabs[newIndex]?.path)
  }

  // 处理标签关闭
  const handleTabClose = (id: number) => {
    setTabs(prevTabs => {
      const remainingTabs = prevTabs.filter(tab => tab.id !== id)

      // 如果所有标签都被关闭，只保留首页
      if (remainingTabs.length === 0) {
        setActiveTabIndex(0)
        navigate('/')
        return [] // 确保只保留首页
      }

      // 保持当前活动标签
      const newActiveTabIndex = Math.min(activeTabIndex, remainingTabs.length - 1)
      setActiveTabIndex(newActiveTabIndex)
      navigate(remainingTabs[newActiveTabIndex]?.path)
      return remainingTabs
    })
  }

  return { tabs, activeTabIndex, handleTabChange, handleTabClose }
}

export default useDynamicTabs
