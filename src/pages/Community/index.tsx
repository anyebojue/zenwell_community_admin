import { memo } from 'react'
import Box from '@mui/material/Box'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import TableData from './components/TableData'
import SearchForm from './components/FormSearch'

const CommunityIndex = () => {
  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <SearchForm />
      <TableData />
      <Copyright />
    </Box>
  )
}

export default memo(CommunityIndex)
