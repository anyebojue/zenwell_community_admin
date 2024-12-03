import { memo } from 'react'
import Box from '@mui/material/Box'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import TableDataGrid from './components/TableDataGrid'
import FormData from './components/FormData'

const CellInformation = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { sm: '100%', md: '1700px' },
        height: '100%',
        pt: 8
      }}
    >
      <NavbarBreadcrumbs />
      <FormData />
      <TableDataGrid />
      <Copyright sx={{ mt: 3 }} />
    </Box>
  )
}

export default memo(CellInformation)
