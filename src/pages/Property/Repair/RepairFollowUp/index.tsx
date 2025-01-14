import { memo, useState } from 'react'
import { Box, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { RepairPoolReply } from 'api/model/property/repairPoolModel'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const RepairSettingsIndex = () => {
  const [dialogValue, setDialogValue] = useState<RepairPoolReply | undefined>({})

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <FormSearch />
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">报修回访</Typography>
          </Box>
          <TableData dialogValue={dialogValue} setDialogValue={setDialogValue} />
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(RepairSettingsIndex)
