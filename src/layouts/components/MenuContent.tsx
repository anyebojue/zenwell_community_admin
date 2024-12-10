import { memo, Fragment, useState, useCallback, ElementType } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import getAllRoutes from 'routes'
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

interface IRoute {
  path: string
  meta?: { title?: string; hidden?: boolean; single?: boolean; Icon?: ElementType }
  children?: IRoute[]
}

const MenuContent = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const location = useLocation()
  const visibleRoutes = getAllRoutes.filter(item => !item.meta?.hidden)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const isActiveLink = useCallback((path: string) => location.pathname === path, [location])

  const isAnyChildActive = useCallback(
    (children: IRoute[], parentPath: string) =>
      children.some(child => location.pathname.startsWith(`${parentPath}/${child.path}`)),
    [location]
  )

  const handleClick = useCallback((index: number, event: React.MouseEvent<HTMLElement>) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index))
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const getMenuItemStyle = (isParentActive: boolean) => ({
    pl: isMenuOpen ? '25px' : '',
    borderRight: isParentActive ? '2px solid rgb(22, 119, 255)' : ''
  })

  const renderMenuItem = (item: IRoute, index: number) => {
    const { meta, path, children } = item
    const { Icon, title } = meta || {}
    const isParentActive = isActiveLink(path)
    const hasActiveChild = children && isAnyChildActive(children, path)
    const isExpanded = openIndex === index
    const menuItemStyle = getMenuItemStyle(isParentActive)

    return (
      <Fragment key={index}>
        {meta?.single ? (
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
              selected={isParentActive || hasActiveChild}
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
                  {children.map((child, childIndex) => renderChildMenuItem(child, childIndex))}
                </List>
              </Collapse>
            )}
            {!isMenuOpen && (
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                sx={{ marginTop: 1 }}
              >
                {children?.map((child, childIndex) => renderChildMenuItem(child, childIndex))}
              </Popover>
            )}
          </>
        )}
      </Fragment>
    )
  }
  const renderChildMenuItem = (child: IRoute, childIndex: number) => {
    const { meta: childMeta, path: childPath } = child
    const { Icon: ChildIcon, title: childTitle } = childMeta || {}
    return (
      <NavLink to={childPath} key={childIndex} style={{ color: 'initial' }}>
        <ListItemButton selected={isActiveLink(childPath)} sx={{ pl: '48px' }}>
          <ListItemIcon>{ChildIcon && <ChildIcon />}</ListItemIcon>
          <ListItemText sx={{ ml: '15px', my: '7px' }} primary={childTitle || '未命名'} />
        </ListItemButton>
      </NavLink>
    )
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
            平台端
          </ListSubheader>
        )
      }
    >
      {visibleRoutes.map((item, index) => renderMenuItem(item, index))}
    </List>
  )
}

export default memo(MenuContent)
