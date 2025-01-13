import { memo, useState } from 'react'
import { CommunityReply } from 'api/model/platform/communityModel'
import { Box } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const MyCommunityIndex = () => {
  const [dialogValue, setDialogValue] = useState<CommunityReply>()
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <TableData setDialogValue={setDialogValue} setOpenDialog={setOpenDialog} />
      <Copyright />

      <FormDialog
        dialogValue={dialogValue}
        openDialog={openDialog}
        dialogType="edit"
        setOpenDialog={setOpenDialog}
      />
    </Box>
  )
}

export default memo(MyCommunityIndex)
