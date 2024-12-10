import { memo } from 'react'
import { Box } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'

const RolesIndex = () => {
  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      RolesIndex
      <Copyright />
    </Box>
  )
}

export default memo(RolesIndex)
