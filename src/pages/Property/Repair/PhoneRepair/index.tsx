import { memo, useState } from 'react'
import { RepairPoolReply } from 'api/model/property/repairPoolModel'
import { Box, Button, Theme, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const RepairPoolsIndex = () => {
  const [dialogValue, setDialogValue] = useState<RepairPoolReply>()
  const [dialogType, setDialogType] = useState('add')
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <FormSearch />
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">电话报修</Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => {
                setOpenDialog(true)
                setDialogType('add')
              }}
            >
              登记
            </Button>
          </Box>
          <TableData setDialogValue={setDialogValue} />
        </Box>
      </Box>
      <Copyright />

      <FormDialog
        dialogValue={dialogValue}
        openDialog={openDialog}
        dialogType={dialogType}
        setOpenDialog={setOpenDialog}
      />
    </Box>
  )
}

export default memo(RepairPoolsIndex)
