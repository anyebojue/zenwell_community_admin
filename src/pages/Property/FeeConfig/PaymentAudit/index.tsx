import { memo, useState } from 'react'
import { PayFeeAuditReply } from 'api/model/property/feeConfig/payFeeAuditModel'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Add } from '@mui/icons-material'
import message from 'components/Message'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const PayFeeAuditIndex = () => {
  const [dialogValue, setDialogValue] = useState<PayFeeAuditReply | undefined>()
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">缴费审核</Typography>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={buttonStyles('#2660ad', '#1d428a')}
            onClick={() => {
              if (!selectedRows) {
                message.error('请选择要审核的记录')
                return
              }
              setOpenDialog(true)
            }}
          >
            批量审核
          </Button>
        </Box>
        <TableData
          setSelectedRows={setSelectedRows}
          setDialogValue={setDialogValue}
          setOpenDialog={setOpenDialog}
        />
      </Box>
      <Copyright />
      <FormDialog
        dialogValue={dialogValue}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedRows={selectedRows}
      />
    </Box>
  )
}

export default memo(PayFeeAuditIndex)
