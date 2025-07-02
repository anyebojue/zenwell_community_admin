import { memo } from 'react'
import { useLocation } from 'react-router-dom'
import useAllRoutes, { IRouter } from 'routes'
import { styled, Typography, Breadcrumbs, breadcrumbsClasses } from '@mui/material'
import { NavigateNextRounded } from '@mui/icons-material'
import { useSelector } from 'react-redux'

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

// 修改后的 findRoute，正确处理相对路径
const findRoute = (path: string, routes: IRouter[], parentPath = ''): IRouter['meta'] | null => {
  for (const route of routes) {
    // 拼接父路由和子路由路径
    const fullPath = parentPath + route.path

    // 判断是否匹配当前路径
    if (path === fullPath) {
      return route.meta
    }

    // 如果有子路由，递归查找子路由
    if (route.children) {
      const childRoute = findRoute(path, route.children, fullPath + '/')
      if (childRoute) return childRoute
    }
  }
  return null
}

const NavbarBreadcrumbs = () => {
  const location = useLocation()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const routes = useAllRoutes()
  const pathParts = location.pathname.split('/').filter(Boolean)
  const platformMap = {
    '0': '物业端',
    '1': '平台端',
    '2': '开发端'
  }

  // 递归生成面包屑路径，遍历路径的每一部分，确保包括父路由和子路由
  const breadcrumbs = pathParts.reduce(
    (acc, _, index) => {
      const fullPath = `/${pathParts.slice(0, index + 1).join('/')}`
      const routeMeta = findRoute(fullPath, routes)

      // 将路径和标题加入面包屑
      acc.push({
        title: routeMeta?.title || '未命名',
        path: fullPath
      })
      return acc
    },
    [
      // 初始面包屑为平台信息
      { title: platformMap[info.platform as keyof typeof platformMap] || '???', path: '/' }
    ]
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
