import { memo, useState } from 'react'
import { SpacePersonReply } from 'api/model/property/houses/spacePersonModel'
import { Box, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const SpacePersonsIndex = () => {
  const [dialogValue, setDialogValue] = useState<SpacePersonReply>({})

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <FormSearch />
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <Typography variant="h6">预约订单</Typography>
          </Box>
          <TableData dialogValue={dialogValue} setDialogValue={setDialogValue} />
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(SpacePersonsIndex)
