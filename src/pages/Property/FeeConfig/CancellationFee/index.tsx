import { memo, useState } from 'react'
import { PayFeeBatchReply } from 'api/model/property/feeConfig/payFeeBatchModel'
import { Box, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const PayFeeBatchIndex = () => {
  const [dialogValue, setDialogValue] = useState<PayFeeBatchReply | undefined>()
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">取消费用</Typography>
        </Box>
        <TableData setDialogValue={setDialogValue} setOpenDialog={setOpenDialog} />
      </Box>
      <Copyright />
      <FormDialog dialogValue={dialogValue} openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </Box>
  )
}

export default memo(PayFeeBatchIndex)
