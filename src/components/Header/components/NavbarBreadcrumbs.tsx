import { memo } from 'react'
import { styled, Typography, Breadcrumbs, breadcrumbsClasses } from '@mui/material'
import { NavigateNextRounded } from '@mui/icons-material'

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
  return (
    <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextRounded fontSize="small" />}>
      <Typography variant="body1">Dashboard</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Home
      </Typography>
    </StyledBreadcrumbs>
  )
}

export default memo(NavbarBreadcrumbs)
