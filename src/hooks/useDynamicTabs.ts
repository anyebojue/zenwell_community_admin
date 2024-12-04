import { useState, useEffect, SyntheticEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IRouter } from 'routes'

const useDynamicTabs = (routes: IRouter[]) => {
  const [tabs, setTabs] = useState<{ id: number; label: string; path: string }[]>([])
  const [activeTabIndex, setActiveTabIndex] = useState(-1)
  const navigate = useNavigate()
  const location = useLocation()

  const getRouteTitle = (path: string): string => {
    const findRouteTitle = (routes: IRouter[]): string | undefined => {
      for (const route of routes) {
        if (route.path === path) return route.meta?.title
        if (route.children) {
          const childTitle = findRouteTitle(route.children)
          if (childTitle) return childTitle
        }
      }
      return undefined
    }
    return findRouteTitle(routes) || 'Untitled'
  }

  useEffect(() => {
    const currentPath = location.pathname
    const existingTabIndex = tabs.findIndex(tab => tab.path === currentPath)

    if (existingTabIndex === -1) {
      const title = getRouteTitle(currentPath)
      setTabs(prevTabs => [...prevTabs, { id: Date.now(), label: title, path: currentPath }])
      setActiveTabIndex(tabs.length)
    } else {
      setActiveTabIndex(existingTabIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const handleTabChange = (_: SyntheticEvent, newIndex: number) => {
    setActiveTabIndex(newIndex)
    navigate(tabs[newIndex].path)
  }

  const handleTabClose = (id: number) => {
    setTabs(prevTabs => {
      const remainingTabs = prevTabs.filter(tab => tab.id !== id)
      if (remainingTabs.length > 0) {
        const newActiveTab = remainingTabs[Math.max(0, activeTabIndex - 1)]
        navigate(newActiveTab.path)
        setActiveTabIndex(remainingTabs.findIndex(tab => tab.path === newActiveTab.path))
      } else {
        setActiveTabIndex(-1)
      }
      return remainingTabs
    })
  }

  return { tabs, activeTabIndex, handleTabChange, handleTabClose }
}

export default useDynamicTabs
