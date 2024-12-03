import { memo } from 'react'
import getAllRoutes from 'routes'
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

const NavbarBreadcrumbs = () => {
  const location = useLocation()
  const path = getAllRoutes.filter(item => item.path === location.pathname)[0].meta?.title
  return (
    <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextRounded fontSize="small" />}>
      <Typography variant="body1">平台端</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {path}
      </Typography>
    </StyledBreadcrumbs>
  )
}

export default memo(NavbarBreadcrumbs)
