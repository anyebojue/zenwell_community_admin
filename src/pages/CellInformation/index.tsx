import { memo } from 'react'
import Box from '@mui/material/Box'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import TableDataGrid from './components/TableDataGrid'

const CellInformation = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { sm: '100%', md: '1700px' },
        height: 'calc(100vh - 32px)',
        pt: 8
      }}
    >
      <NavbarBreadcrumbs />
      <TableDataGrid />
      <Copyright sx={{ my: 4 }} />
    </Box>
  )
}

export default memo(CellInformation)
