import { memo } from 'react'
import { Box, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const MeterTypeIndex = () => {
  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Typography variant="h6">剩余车位</Typography>
        </Box>
        <TableData />
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(MeterTypeIndex)
