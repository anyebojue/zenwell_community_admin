import { memo } from 'react'
import getAllRoutes, { IRouter } from 'routes'
import { styled, Typography, Breadcrumbs, breadcrumbsClasses } from '@mui/material'
import { NavigateNextRounded } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center'
  }
}))

const findRoute = (path: string, routes: IRouter[]): IRouter['meta'] | null => {
  for (const route of routes) {
    if (route.path === path) {
      return route.meta
    }
    if (route.children) {
      // 递归查找子路由
      const childRoute = findRoute(path, route.children)
      if (childRoute) return childRoute
    }
  }
  return null
}

const NavbarBreadcrumbs = () => {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = pathParts.reduce(
    (acc, _, index) => {
      const fullPath = `/${pathParts.slice(0, index + 1).join('/')}`
      const routeMeta = findRoute(fullPath, getAllRoutes)
      acc.push({
        title: routeMeta?.title || '未命名',
        path: fullPath
      })
      return acc
    },
    [{ title: '平台端', path: '/' }]
  )

  return (
    <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextRounded fontSize="small" />}>
      {breadcrumbs.map((breadcrumb, index) => (
        <Typography
          key={breadcrumb.path}
          variant="body1"
          sx={{
            color: index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit',
            fontWeight: index === breadcrumbs.length - 1 ? 600 : 'normal'
          }}
        >
          {breadcrumb.title}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  )
}

export default memo(NavbarBreadcrumbs)
