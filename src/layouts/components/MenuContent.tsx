import { memo, Fragment, useState, useEffect, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import getAllRoutes from 'routes'
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

const MenuContent = () => {
  const location = useLocation()
  const visibleRoutes = getAllRoutes.filter(item => !item.meta?.hidden)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isActiveLink = useCallback((path: string) => location.pathname === path, [location])
  const linkStyle = { textDecoration: 'none', color: 'rgba(0, 0, 0, 0.54)' }

  // 判断路径是否匹配某个父菜单或其子菜单
  const isAnyChildActive = useCallback(
    (children: any[], parentPath: string) =>
      children.some(child => location.pathname.startsWith(`${parentPath}/${child.path}`)),
    [location]
  )

  useEffect(() => {
    // 初始化展开状态，仅在组件首次加载时根据路径匹配
    if (openIndex === null) {
      const matchedIndex = visibleRoutes.findIndex(item => {
        const { path, children } = item
        return location.pathname.startsWith(path) || (children && isAnyChildActive(children, path))
      })
      if (matchedIndex !== -1) {
        setOpenIndex(matchedIndex)
      }
    }
  }, [location.pathname, visibleRoutes, isAnyChildActive, openIndex])

  const handleClick = useCallback((index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index))
  }, [])

  return (
    <List component="nav" aria-labelledby="nested-list-subheader" sx={{ p: 1 }}>
      {visibleRoutes.map((item, index) => {
        const { meta, path, children } = item
        const { Icon, title } = meta || {}
        const isParentActive = isActiveLink(path)
        const hasActiveChild = children && isAnyChildActive(children, path)
        const isExpanded = openIndex === index

        return (
          <Fragment key={index}>
            {meta?.single ? (
              <NavLink to={path} style={linkStyle}>
                <ListItemButton selected={isParentActive}>
                  <ListItemIcon>{Icon && <Icon />}</ListItemIcon>
                  <ListItemText sx={{ ml: '10px', my: 0 }} primary={title || '未命名'} />
                </ListItemButton>
              </NavLink>
            ) : (
              <>
                <ListItemButton
                  selected={isParentActive && !hasActiveChild}
                  onClick={() => handleClick(index)}
                >
                  <ListItemIcon>{Icon && <Icon />}</ListItemIcon>
                  <ListItemText sx={{ ml: '10px', my: 0 }} primary={title || '未命名'} />
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {children && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {children.map((child, childIndex) => {
                        const { meta: childMeta, path: childPath } = child
                        const { Icon: ChildIcon, title: childTitle } = childMeta || {}
                        return (
                          <NavLink to={childPath} key={childIndex} style={linkStyle}>
                            <ListItemButton selected={isActiveLink(childPath)} sx={{ pl: 4 }}>
                              <ListItemIcon>{ChildIcon && <ChildIcon />}</ListItemIcon>
                              <ListItemText
                                sx={{ ml: '16px', my: 0 }}
                                primary={childTitle || '未命名'}
                              />
                            </ListItemButton>
                          </NavLink>
                        )
                      })}
                    </List>
                  </Collapse>
                )}
              </>
            )}
          </Fragment>
        )
      })}
    </List>
  )
}

export default memo(MenuContent)
