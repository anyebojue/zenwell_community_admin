import { memo, Fragment, useState, useEffect, useCallback, ElementType } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import getAllRoutes from 'routes'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListSubheader
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

// Define the IRoute type based on your route structure
interface IRoute {
  path: string
  meta?: { title?: string; hidden?: boolean; single?: boolean; Icon?: ElementType }
  children?: IRoute[]
}

const MenuContent = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const location = useLocation()
  const visibleRoutes = getAllRoutes.filter(item => !item.meta?.hidden)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isActiveLink = useCallback((path: string) => location.pathname === path, [location])

  // 判断路径是否匹配某个父菜单或其子菜单
  const isAnyChildActive = useCallback(
    (children: IRoute[], parentPath: string) =>
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
    <List
      sx={{ width: '100%', maxWidth: 370, paddingTop: 0 }}
      component="nav"
      subheader={
        isMenuOpen && (
          <ListSubheader
            sx={{
              paddingTop: '16px',
              paddingLeft: '24px',
              marginBottom: '12px',
              fontSize: '0.75rem'
            }}
          >
            平台端
          </ListSubheader>
        )
      }
    >
      {visibleRoutes.map((item, index) => {
        const { meta, path, children } = item
        const { Icon, title } = meta || {}
        const isParentActive = isActiveLink(path)
        const hasActiveChild = children && isAnyChildActive(children, path)
        const isExpanded = openIndex === index
        return (
          <Fragment key={index}>
            {meta?.single ? (
              <NavLink to={path} style={{ color: 'initial' }}>
                <ListItemButton
                  sx={
                    isMenuOpen
                      ? {
                          pl: '25px',
                          borderRight: isParentActive ? '2px solid rgb(22, 119, 255)' : ''
                        }
                      : {
                          pl: '25px',
                          margin: '7px',
                          padding: '10px 0',
                          borderRadius: '10px'
                        }
                  }
                  selected={isParentActive}
                >
                  <ListItemIcon sx={{ margin: '0 auto' }}>{Icon && <Icon />}</ListItemIcon>
                  {isMenuOpen && (
                    <ListItemText sx={{ ml: '15px', my: '7px' }} primary={title || '未命名'} />
                  )}
                </ListItemButton>
              </NavLink>
            ) : (
              <>
                <ListItemButton
                  selected={isParentActive && !hasActiveChild}
                  onClick={() => handleClick(index)}
                >
                  <ListItemIcon>{Icon && <Icon />}</ListItemIcon>
                  <ListItemText sx={{ ml: '15px', my: '7px' }} primary={title || '未命名'} />
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {children && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {children.map((child, childIndex) => {
                        const { meta: childMeta, path: childPath } = child
                        const { Icon: ChildIcon, title: childTitle } = childMeta || {}
                        return (
                          <NavLink to={childPath} key={childIndex} style={{ color: 'initial' }}>
                            <ListItemButton
                              selected={isActiveLink(childPath)}
                              sx={{
                                borderRight: isParentActive ? '2px solid rgb(22, 119, 255)' : '',
                                pl: 4
                              }}
                            >
                              <ListItemIcon>{ChildIcon && <ChildIcon />}</ListItemIcon>
                              <ListItemText
                                sx={{ ml: '15px', my: '7px' }}
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
