import { memo, useState } from 'react'
import { ChargeMonthOrderReply } from 'api/model/property/parking/chargeMonthOrderModel'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Add } from '@mui/icons-material'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ParkingLotManagementIndex = () => {
  const [dialogValue, setDialogValue] = useState<ChargeMonthOrderReply | undefined>()
  console.log(dialogValue)
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">停车位信息</Typography>
          <Box>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={{ marginRight: '10px', ...buttonStyles('#2660ad', '#1d428a') }}
              onClick={() => {}}
            >
              二维码购买
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setOpenDialog(true)}
            >
              购买月卡
            </Button>
          </Box>
        </Box>
        <TableData setDialogValue={setDialogValue} />
      </Box>
      <Copyright />
      <FormDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </Box>
  )
}

export default memo(ParkingLotManagementIndex)
