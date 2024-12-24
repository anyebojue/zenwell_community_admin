import { memo, Fragment, useState, useCallback, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useAllRoutes, { IRouter } from 'routes'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListSubheader,
  Tooltip,
  Popover
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

const MenuContent = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const location = useLocation()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const routes = useAllRoutes()
  const visibleRoutes = routes.filter(item => !item.meta?.hidden)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [activePopoverIndex, setActivePopoverIndex] = useState<number | null>(null)

  const isActiveLink = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location]
  )

  const isAnyChildActive = useCallback(
    (children: IRouter[], parentPath: string) =>
      children.some(child => location.pathname.startsWith(`${parentPath}/${child.path}`)),
    [location]
  )

  useEffect(() => {
    const activeIndex = visibleRoutes.findIndex(
      item =>
        isActiveLink(item.path) || (item.children && isAnyChildActive(item.children, item.path))
    )
    if (openIndex === null) {
      setOpenIndex(activeIndex !== -1 ? activeIndex : null)
    }
  }, [location.pathname, visibleRoutes, isActiveLink, isAnyChildActive, openIndex])

  const handleClick = useCallback((index: number, event: React.MouseEvent<HTMLElement>) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index))
    setAnchorEl(event.currentTarget)
    setActivePopoverIndex(index)
  }, [])

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null)
    setActivePopoverIndex(null)
  }, [])

  const getMenuItemStyle = (isParentActive: boolean) => ({
    pl: isMenuOpen ? '25px' : '',
    borderRight: isParentActive ? '2px solid rgb(22, 119, 255)' : ''
  })

  const isItemActive = (item: IRouter) => {
    const { path, children } = item
    return isActiveLink(path) || (children && isAnyChildActive(children, path))
  }

  const renderMenuItem = (item: IRouter, index: number) => {
    const { meta, path, children } = item
    const { Icon, title } = meta || {}
    const isParentActive = isItemActive(item)
    const isExpanded = openIndex === index
    const menuItemStyle = getMenuItemStyle(isParentActive || false)

    return (
      <Fragment key={index}>
        {meta?.single || children?.every(child => child.meta?.hidden === true) ? (
          <NavLink to={path} style={{ color: 'initial' }}>
            <ListItemButton sx={menuItemStyle} selected={isParentActive}>
              <Tooltip title={title || '未命名'}>
                <ListItemIcon sx={{ margin: '0 auto' }}>{Icon && <Icon />}</ListItemIcon>
              </Tooltip>
              {isMenuOpen && (
                <ListItemText sx={{ ml: '15px', my: '7px' }} primary={title || '未命名'} />
              )}
            </ListItemButton>
          </NavLink>
        ) : (
          <>
            <ListItemButton
              sx={menuItemStyle}
              selected={isParentActive}
              onClick={event => handleClick(index, event)}
            >
              <Tooltip title={title || '未命名'}>
                <ListItemIcon sx={{ margin: '0 auto' }}>{Icon && <Icon />}</ListItemIcon>
              </Tooltip>
              {isMenuOpen && (
                <>
                  <ListItemText sx={{ ml: '15px', my: '7px' }} primary={title || '未命名'} />
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
            {isMenuOpen && children && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {children
                    .filter(child => !child.meta?.hidden)
                    .map((child, childIndex) => renderChildMenuItem(child, childIndex, path))}
                </List>
              </Collapse>
            )}
            {!isMenuOpen && (
              <Popover
                open={activePopoverIndex === index}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                sx={{ marginTop: 1 }}
              >
                {children
                  ?.filter(child => !child.meta?.hidden)
                  .map((child, childIndex) => renderChildMenuItem(child, childIndex, path))}
              </Popover>
            )}
          </>
        )}
      </Fragment>
    )
  }

  const renderChildMenuItem = (child: IRouter, childIndex: number, parentPath: string) => {
    const { meta: childMeta, path: childPath } = child
    const { Icon: ChildIcon, title: childTitle } = childMeta || {}
    const isChildActive = isActiveLink(`${parentPath}/${childPath}`)

    return (
      <NavLink to={`${parentPath}/${childPath}`} key={childIndex} style={{ color: 'initial' }}>
        <ListItemButton selected={isChildActive} sx={{ pl: '48px' }}>
          <ListItemIcon>{ChildIcon && <ChildIcon />}</ListItemIcon>
          <ListItemText sx={{ ml: '15px', my: '7px' }} primary={childTitle || '未命名'} />
        </ListItemButton>
      </NavLink>
    )
  }

  const platformMap = {
    '0': '物业端',
    '1': '平台端',
    '2': '开发端'
  }

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
            {platformMap[info.platform as keyof typeof platformMap]}
          </ListSubheader>
        )
      }
    >
      {visibleRoutes.map((item, index) => renderMenuItem(item, index))}
    </List>
  )
}

export default memo(MenuContent)
